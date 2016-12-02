$data = @(
@{
    enode = "e123";
    network = "abc";
    ip = "1.2.3.4";
    publicIp = "4.3.2.1";
    port = "8000"
},
@{
    enode = "e321";
    network = "abc";
    ip = "1.2.3.4";
    publicIp = "4.3.2.1";
    port = "8000"
}
)

$req = $data | %{ Invoke-WebRequest -Uri "http://localhost:3000" -Method Post -Body $($_ | ConvertTo-Json) -ContentType "application/json" }

@(
    ((Invoke-WebRequest -Uri "http://localhost:3000/enodes").Content),
    ((Invoke-WebRequest -Uri "http://localhost:3000/enodes?network=abc").Content)
    ((Invoke-WebRequest -Uri "http://localhost:3000/staticenodes?network=abc").Content)
    ((Invoke-WebRequest -Uri "http://localhost:3000/parityenodes?network=abc").Content)
)
