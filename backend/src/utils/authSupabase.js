const { createClient } = require('@supabase/supabase-js');
const supabase = require('./supabase');

module.exports = (accessToken) => {
    return createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_KEY,
        {
            global: {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            },
            auth: {
                persistSession: false
            }
        }
    );
};