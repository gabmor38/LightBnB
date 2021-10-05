SELECT properties.*, reservations.*, avg(rating) as average_rating
FROM reservations
JOIN properties on reservations.property_id = properties.id
JOIN property_reviews ON properties.id = property_reviews.property_id
WHERE reservations.guest_id = 1 AND reservations.end_date < now()::date
GROUP BY reservations.id, properties.id
Order By reservations.start_date
Limit 10;