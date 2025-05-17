const supabase = require('../utils/supabase');
const { AppError } = require('../utils/error');
const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');

class AuthService {
  /**
   * Sign in a user with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} - User data and session
   */
  async signIn(email, password) {
    try {
      // Authenticate with Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) {
        throw new AppError(authError.message, StatusCodes.UNAUTHORIZED);
      }

      if (!authData.user) {
        throw new AppError('Authentication failed', StatusCodes.UNAUTHORIZED);
      }

      // Fetch user profile from our profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, name, email, role')
        .eq('id', authData.user.id)
        .single();

      if (profileError) {
        throw new AppError('Failed to fetch user profile', StatusCodes.INTERNAL_SERVER_ERROR);
      }

      if (!profileData) {
        throw new AppError('User profile not found', StatusCodes.NOT_FOUND);
      }

      // Generate our own JWT token for additional security
      const token = jwt.sign(
        { 
          id: profileData.id,
          email: profileData.email,
          role: profileData.role
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      return {
        user: profileData,
        session: {
          access_token: token,
          refresh_token: authData.session.refresh_token,
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
        }
      };
    } catch (error) {
      if (error.isOperational) {
        throw error;
      }
      throw new AppError(error.message || 'Authentication failed', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Sign up a new user
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {string} name - User name
   * @returns {Promise<Object>} - User data
   */
  async signUp(email, password, name) {
    try {
      // Register with Supabase
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name
          }
        }
      });

      if (authError) {
        throw new AppError(authError.message, StatusCodes.BAD_REQUEST);
      }

      if (!authData.user) {
        throw new AppError('User registration failed', StatusCodes.BAD_REQUEST);
      }

      // Supabase trigger automatically creates a profile record, but we'll check it
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, name, email, role')
        .eq('id', authData.user.id)
        .single();

      if (profileError || !profileData) {
        // Create profile manually if trigger didn't work
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            name,
            email,
            role: 'customer'
          })
          .select('id, name, email, role')
          .single();

        if (createError) {
          throw new AppError('Failed to create user profile', StatusCodes.INTERNAL_SERVER_ERROR);
        }

        return { user: newProfile, message: 'User registered successfully' };
      }

      return { user: profileData, message: 'User registered successfully' };
    } catch (error) {
      if (error.isOperational) {
        throw error;
      }
      throw new AppError(error.message || 'Registration failed', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Sign out a user
   * @param {string} refreshToken - User's refresh token
   * @returns {Promise<Object>} - Success message
   */
  async signOut(refreshToken) {
    try {
      const { error } = await supabase.auth.signOut({ 
        refreshToken 
      });

      if (error) {
        throw new AppError(error.message, StatusCodes.INTERNAL_SERVER_ERROR);
      }

      return { message: 'Signed out successfully' };
    } catch (error) {
      if (error.isOperational) {
        throw error;
      }
      throw new AppError(error.message || 'Sign out failed', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Get user session
   * @param {string} accessToken - User's JWT token
   * @returns {Promise<Object>} - User session data
   */
  async getSession(accessToken) {
    try {
      if (!accessToken) {
        throw new AppError('No access token provided', StatusCodes.UNAUTHORIZED);
      }

      // Verify our custom JWT token
      const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
      
      // Get user profile from database
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, name, email, role')
        .eq('id', decoded.id)
        .single();

      if (profileError || !profileData) {
        throw new AppError('User profile not found', StatusCodes.NOT_FOUND);
      }

      return {
        user: profileData,
        session: {
          access_token: accessToken,
          expires_at: new Date(decoded.exp * 1000)
        }
      };
    } catch (error) {
      if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
        throw new AppError('Invalid or expired token', StatusCodes.UNAUTHORIZED);
      }
      if (error.isOperational) {
        throw error;
      }
      throw new AppError(error.message || 'Failed to get session', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Refresh user token
   * @param {string} refreshToken - User's refresh token
   * @returns {Promise<Object>} - New tokens
   */
  async refreshToken(refreshToken) {
    try {
      if (!refreshToken) {
        throw new AppError('No refresh token provided', StatusCodes.UNAUTHORIZED);
      }

      // Refresh the Supabase token
      const { data: authData, error: authError } = await supabase.auth.refreshSession({
        refresh_token: refreshToken
      });

      if (authError) {
        throw new AppError(authError.message, StatusCodes.UNAUTHORIZED);
      }

      if (!authData.session) {
        throw new AppError('Failed to refresh session', StatusCodes.UNAUTHORIZED);
      }

      // Get user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, name, email, role')
        .eq('id', authData.user.id)
        .single();

      if (profileError || !profileData) {
        throw new AppError('User profile not found', StatusCodes.NOT_FOUND);
      }

      // Generate our own JWT token
      const token = jwt.sign(
        { 
          id: profileData.id,
          email: profileData.email,
          role: profileData.role
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      return {
        user: profileData,
        session: {
          access_token: token,
          refresh_token: authData.session.refresh_token,
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
        }
      };
    } catch (error) {
      if (error.isOperational) {
        throw error;
      }
      throw new AppError(error.message || 'Failed to refresh token', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Get user profile by ID
   * @param {string} userId - User ID
   * @returns {Promise<Object>} - User profile
   */
  async getUserProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, email, role')
        .eq('id', userId)
        .single();

      if (error) {
        throw new AppError(error.message, StatusCodes.INTERNAL_SERVER_ERROR);
      }

      if (!data) {
        throw new AppError('User profile not found', StatusCodes.NOT_FOUND);
      }

      return { user: data };
    } catch (error) {
      if (error.isOperational) {
        throw error;
      }
      throw new AppError(error.message || 'Failed to get user profile', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

module.exports = new AuthService();