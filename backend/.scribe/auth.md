# Authenticating requests

To authenticate requests, include an **`Authorization`** header with the value **`"Bearer 1|YOUR_TOKEN_HERE"`**.

All authenticated endpoints are marked with a `requires authentication` badge in the documentation below.

Login first using POST /api/login, then copy the token from the response. Paste only the token value, without the word Bearer.
