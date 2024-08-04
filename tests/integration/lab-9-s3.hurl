# POST a new text fragment
POST http://localhost:8080/v1/fragments
Content-Type: text/plain
[BasicAuth]
user1@email.com:password1
`Hello S3!`

# Check for 201 status and capture the Location header
HTTP/1.1 201
[Captures]
url: header "Location"

# GET the created fragment
GET {{url}}
[BasicAuth]
user1@email.com:password1
`Hello S3!`

# Check for 200 status, correct Content-Type, and body
HTTP/1.1 200
Content-Type: text/plain
[Asserts]
body == "Hello S3!"

# DELETE the fragment
DELETE {{url}}
[BasicAuth]
user1@email.com:password1


# Check for 200 status
HTTP/1.1 200

# Try to GET the deleted fragment
GET {{url}}
[BasicAuth]
user1@email.com:password1


# Check for 404 status
HTTP/1.1 404
