$email = "test_user_$(Get-Random)@example.com"
$password = "test1234"
try {
    Write-Host "Trying existing user login..."
    $loginBody = @{email="admin@example.com"; password="password123"} | ConvertTo-Json
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:3001/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
    $token = $loginResponse.token
    Write-Host "Login Success"

    Write-Host "Getting products..."
    $products = Invoke-RestMethod -Uri "http://localhost:3001/products" -Method Get
    $productId = if ($products[0]._id) { $products[0]._id } else { $products[0].id }
    
    Write-Host "Creating checkout session..."
    $checkoutBody = @{
        items = @(@{productId=$productId; quantity=1});
        shippingAmount = 25;
        taxAmount = 5;
        currency = "USD"
    } | ConvertTo-Json
    $headers = @{ Authorization = "Bearer $token" }
    $checkoutResponse = Invoke-RestMethod -Uri "http://localhost:3001/stripe/checkout-session" -Method Post -Body $checkoutBody -ContentType "application/json" -Headers $headers
    
    Write-Host "User: admin@example.com"
    Write-Host "Product ID: $productId"
    Write-Host "Order ID: $($checkoutResponse.orderId)"
    Write-Host "Stripe Session ID: $($checkoutResponse.sessionId)"
    Write-Host "Checkout URL Exists: $($null -ne $checkoutResponse.url)"
} catch {
    Write-Host "Error: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $body = $reader.ReadToEnd()
        Write-Host "Status Code: $($_.Exception.Response.StatusCode)"
        Write-Host "Body: $body"
    }
}
