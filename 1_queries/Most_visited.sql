SELECT distinct properties.city as city, count(property_id )AS total_reservations
FROM properties, reservations
Group BY property_id, properties.city
Order by total_reservations DESC;
