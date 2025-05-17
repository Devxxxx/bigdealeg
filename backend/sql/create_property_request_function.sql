-- Create a stored procedure to bypass RLS for property request creation
CREATE OR REPLACE FUNCTION create_property_request(request_data JSONB)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER -- This means the function runs with the privileges of the creator
AS $$
DECLARE
  inserted_id UUID;
  result JSONB;
BEGIN
  -- Insert the data into property_requests
  INSERT INTO property_requests (
    id,
    title,
    property_type,
    location,
    min_price,
    max_price,
    bedrooms,
    bathrooms,
    area_size,
    additional_features,
    custom_fields,
    status,
    user_id,
    created_at,
    updated_at
  ) VALUES (
    (request_data->>'id')::UUID,
    request_data->>'title',
    request_data->>'property_type',
    request_data->>'location',
    (request_data->>'min_price')::NUMERIC,
    (request_data->>'max_price')::NUMERIC,
    request_data->>'bedrooms',
    request_data->>'bathrooms',
    (request_data->>'area_size')::NUMERIC,
    request_data->>'additional_features',
    (request_data->'custom_fields')::JSONB,
    request_data->>'status',
    (request_data->>'user_id')::UUID,
    (request_data->>'created_at')::TIMESTAMP WITH TIME ZONE,
    (request_data->>'updated_at')::TIMESTAMP WITH TIME ZONE
  )
  RETURNING id INTO inserted_id;
  
  -- Create a result object
  result := jsonb_build_object(
    'id', inserted_id,
    'message', 'Property request created successfully'
  );
  
  RETURN result;
END;
$$;