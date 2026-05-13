$email = "test_user_$(Get-Random)@example.com"
$password = "Password123!"
try {
    Write-Host "Registering..."
    $registerResponse = Invoke-RestMethod -Uri "http://localhost:3001/auth/register" -Method Post -Body (@{email=$email; password=$password} | ConvertTo-Json) -ContentType "application/json"
    Write-Host "Logging in..."
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:3001/auth/login" -Method Post -Body (@{email=$email; password=$password} | ConvertTo-Json) -ContentType "application/json"
    $token = $loginResponse.token
    Write-Host "Getting products..."
    $products = Invoke-RestMethod -Uri "http://localhost:3001/products" -Method Get
    $productId = if ($products[0]._id) { $products[0]._id } else { $products[0].id }
    Write-Host "Creating checkout session for product $productId..."
    $checkoutBody = @{
        items = @(@{productId=$productId; quantity=1});
        shippingAmount = 25;
        taxAmount = 5;
        currency = "USD"
    } | ConvertTo-Json
    $headers = @{ Authorization = "Bearer $token" }
    $checkoutResponse = Invoke-RestMethod -Uri "http://localhost:3001/stripe/checkout-session" -Method Post -Body $checkoutBody -ContentType "application/json" -Headers $headers
    Write-Host "User: $email"
    Write-Host "Product ID: $productId"
    Write-Host "Order ID: $($checkoutResponse.orderId)"
    Write-Host "Stripe Session ID: $($checkoutResponse.sessionId)"
    Write-Host "Checkout URL Exists: $($null -ne $checkoutResponse.url)"
} catch {
    Write-Host "Error: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $body = $reader.ReadToEnd()
        Write-Host "Status: $($_.Exception.Response.StatusCode)"
        Write-Host "Body: $body"
    }
}
