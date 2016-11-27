$data = @{
    enode = "e123";
    network = "abc";
    ip = "1.2.3.4";
    publicIp = "4.3.2.1";
    port = "8000"
} | ConvertTo-Json

$req = Invoke-WebRequest -Uri "http://localhost:3000" -Method Post -Body $data -ContentType "application/json"

@(
    ((Invoke-WebRequest -Uri "http://localhost:3000/enodes").Content),
    ((Invoke-WebRequest -Uri "http://localhost:3000/enodes?network=abc").Content)
)