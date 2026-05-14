$ErrorActionPreference = "Stop"
$root = Join-Path $PSScriptRoot "..\public\landing" | Resolve-Path
Get-ChildItem (Join-Path $root "*.html") | ForEach-Object {
  $c = [IO.File]::ReadAllText($_.FullName)
  $c = [regex]::Replace($c, "<!--\s*Mirrored from srrafi\.com/pictech-lat[^>]*-->", "", "IgnoreCase")
  $c = $c.Replace("Pictech - Creative HTML5 Template for Saas, Startup & Agency", "ASPIRE ENTREPRENEUR")
  $c = $c.Replace("PicmaticWeb", "ASPIRE ENTREPRENEUR")
  $c = $c.Replace("Picmatic Ltd.", "ASPIRE ENTREPRENEUR")
  $c = $c.Replace("Pictech", "ASPIRE ENTREPRENEUR")

  $navSticky = '<a class="navbar-brand sticky_logo text-decoration-none" href="/" style="font-weight:800;font-size:0.9rem;letter-spacing:0.06em;line-height:1.15;">ASPIRE ENTREPRENEUR</a>'
  $c = [regex]::Replace(
    $c,
    '<a\s+class="navbar-brand\s+sticky_logo"\s+href="[^"]*">\s*<img[^>]*>\s*<img[^>]*>\s*</a>',
    $navSticky,
    "Singleline"
  )

  $navPlain = '<a class="navbar-brand text-decoration-none" href="/" style="font-weight:800;font-size:0.95rem;letter-spacing:0.06em;">ASPIRE ENTREPRENEUR</a>'
  $c = [regex]::Replace(
    $c,
    '<a\s+class="navbar-brand"\s+href="[^"]*">\s*<img[^>]*>\s*</a>',
    $navPlain,
    "Singleline"
  )

  $fLogo = '<a href="/" class="f_logo text-decoration-none text-white d-inline-block" style="font-weight:700;font-size:0.75rem;letter-spacing:0.07em;">ASPIRE ENTREPRENEUR</a>'
  $c = [regex]::Replace(
    $c,
    '<a\s+href="[^"]*"\s+class="f_logo">\s*<img\s+src="assets/img/home-two/f_logo_w\.png"\s+alt="">\s*</a>',
    $fLogo,
    "Singleline"
  )

  [IO.File]::WriteAllText($_.FullName, $c, [Text.UTF8Encoding]::new($false))
}

# Second pass: leftover theme names (case variants)
Get-ChildItem (Join-Path $root "*.html") | ForEach-Object {
  $c = [IO.File]::ReadAllText($_.FullName)
  $c = $c.Replace("Picmaticweb", "ASPIRE ENTREPRENEUR")
  $c = $c.Replace("PicmaticWeb", "ASPIRE ENTREPRENEUR")
  $c = $c.Replace("Picmatic time", "The platform")
  $c = $c.Replace("Picmatic", "ASPIRE ENTREPRENEUR")
  $c = $c.Replace("picmatic@support.com", "hello@aspire-entrepreneur.local")
  [IO.File]::WriteAllText($_.FullName, $c, [Text.UTF8Encoding]::new($false))
}
Write-Host "Done."
