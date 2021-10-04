SELECT properties.* AS property, avg(rating) as Average_rating
FROM properties, property_reviews
WHERE city = 'Vancouver' AND rating >= 4
GROUP by properties.id
Order by cost_per_night
Limit 10;