Add-Type -AssemblyName System.Drawing
$assets = @('icon.png', 'adaptive-icon.png', 'favicon.png', 'splash.png')
foreach ($name in $assets) {
    $path = "d:\Ma lecture de la Bilble\bible-app\assets\$name"
    if (Test-Path $path) {
        $img = [System.Drawing.Image]::FromFile($path)
        $tmp = $path + ".tmp"
        $img.Save($tmp, [System.Drawing.Imaging.ImageFormat]::Png)
        $img.Dispose()
        Move-Item $tmp $path -Force
        Write-Host "Converted $name to PNG"
    } else {
        Write-Host "File $name not found"
    }
}
