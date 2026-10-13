$ErrorActionPreference = 'Stop'
$files = @('backend/deploy-ec2.sh', 'backend/EC2-DEPLOYMENT.md')
foreach ($file in $files) {
  if (-not (Test-Path $file)) { continue }
  $content = Get-Content $file
  $filtered = $content | Where-Object {
    $_ -notmatch 'AWS_ACCESS_KEY_ID\s*=\s*AKIA[0-9A-Z]{16}' -and
    $_ -notmatch 'AWS_SECRET_ACCESS_KEY\s*=\s*[^\s]+'
  }
  Set-Content -Path $file -Value $filtered -Encoding utf8
  Write-Host "Removed embedded credential assignment lines from $file"
}
Write-Host 'If these credentials were ever valid, deactivate/delete them in AWS IAM immediately and review CloudTrail.'
