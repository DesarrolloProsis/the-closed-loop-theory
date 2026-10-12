param(
    [string]$Workspace = (Split-Path -Parent $PSScriptRoot),
    [string[]]$Sheets = @()
)
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$spriteDirectory = Join-Path $Workspace 'assets\sprites'
$specs = @(
    @{Sheet='heroes';Cuts=@(0,295,556,887);Names=@('hero','zelda','groose');Heights=@(56,46,58)},
    @{Sheet='guardians';Cuts=@(0,266,548,768);Names=@('hylia','impa','old-impa');Heights=@(60,60,40)},
    @{Sheet='impa-v2';Cuts=@(0,[int]::MaxValue);Names=@('impa');Heights=@(60);Columns=8},
    @{Sheet='spirits';Cuts=@(0,318,604,887);Names=@('demise','ghirahim','fi');Heights=@(64,58,56)},
    @{Sheet='zelda-v3';Cuts=@(0,[int]::MaxValue);Names=@('zelda');Heights=@(46);Columns=8},
    @{Sheet='old-impa-v2';Cuts=@(0,[int]::MaxValue);Names=@('old-impa');Heights=@(44);Columns=8},
    @{Sheet='monster-v2';Cuts=@(0,[int]::MaxValue);Names=@('imprisoned');Heights=@(52);Columns=4},
    @{Sheet='swords-v2';Cuts=@(0,[int]::MaxValue);Names=@('goddess-sword','master-sword','demise-sword');Heights=@(48,48,56);Columns=3;SingleCells=$true},
    @{Sheet='crystal-v2';Cuts=@(0,[int]::MaxValue);Names=@('crystal');Heights=@(62);Columns=1},
    @{Sheet='zelda-white-v2';Cuts=@(0,[int]::MaxValue);Names=@('zelda-white');Heights=@(46);Columns=8},
    @{Sheet='crystal-white-v2';Cuts=@(0,[int]::MaxValue);Names=@('crystal-white');Heights=@(62);Columns=1},
    @{Sheet='gate-v3';Cuts=@(0,[int]::MaxValue);Names=@('gate');Heights=@(60);Columns=1},
    @{Sheet='statue-v3';Cuts=@(0,[int]::MaxValue);Names=@('statue');Heights=@(60);Columns=1},
    @{Sheet='triforce';Cuts=@(0,[int]::MaxValue);Names=@('triforce');Heights=@(32);Columns=1},
    @{Sheet='goddess-harp';Cuts=@(0,[int]::MaxValue);Names=@('goddess-harp');Heights=@(26);Columns=1},
    @{Sheet='zelda-bracelet';Cuts=@(0,[int]::MaxValue);Names=@('zelda-bracelet');Heights=@(18);Columns=1},
    @{Sheet='lanayru';Cuts=@(0,[int]::MaxValue);Names=@('lanayru');Heights=@(68);Columns=1},
    @{Sheet='life-tree-fruit';Cuts=@(0,[int]::MaxValue);Names=@('life-tree-fruit');Heights=@(24);Columns=1}
)
$manifest = @{}
if ($Sheets.Count) {
    # Rebuild edited sheets without resampling unrelated artwork.
    foreach ($sheet in $Sheets) {
        if ($sheet -notin $specs.Sheet) {throw "Unknown source sheet: $sheet"}
    }
    $manifestPath = Join-Path $spriteDirectory 'manifest.json'
    if (-not (Test-Path -LiteralPath $manifestPath)) {throw 'Run a full sprite preparation before selecting individual sheets.'}
    $savedManifest = Get-Content -LiteralPath $manifestPath -Raw | ConvertFrom-Json
    foreach ($property in $savedManifest.PSObject.Properties) {
        $manifest[$property.Name] = $property.Value
    }
    $specs = @($specs | Where-Object {$_.Sheet -in $Sheets})
}
foreach ($spec in $specs) {
    $sourcePath = Join-Path $spriteDirectory ($spec.Sheet + '-source.png')
    $source = [System.Drawing.Bitmap]::new($sourcePath)
    $rect = [System.Drawing.Rectangle]::new(0,0,$source.Width,$source.Height)
    $locked = $source.LockBits($rect,[System.Drawing.Imaging.ImageLockMode]::ReadOnly,[System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $pixels = [byte[]]::new($locked.Stride * $source.Height)
    [System.Runtime.InteropServices.Marshal]::Copy($locked.Scan0,$pixels,0,$pixels.Length)
    $stride = $locked.Stride
    $source.UnlockBits($locked)
    for ($row=0; $row -lt $spec.Names.Count; $row++) {
        $columnCount = if ($spec.Columns) {$spec.Columns} else {8}
        $sourceRow = if ($spec.SingleCells) {0} else {$row}
        $top = $spec.Cuts[$sourceRow]
        $bottom = [Math]::Min($spec.Cuts[$sourceRow+1],$source.Height)
        $projection = [int[]]::new($source.Width)
        for ($y=$top; $y -lt $bottom; $y++) {
            for ($x=0; $x -lt $source.Width; $x++) {
                if ($pixels[$y*$stride+$x*4+3] -gt 96) {$projection[$x]++}
            }
        }
        # Generated sheets have slightly uneven spacing. Find the empty
        # column valleys instead of clipping at nominal cell boundaries.
        $cuts = @(0)
        for ($column=1; $column -lt $columnCount; $column++) {
            $ideal = $column*$source.Width/$columnCount
            $radius = $source.Width/$columnCount*.27
            $best = [int]$ideal
            $bestScore = [double]::PositiveInfinity
            for ($x=[int]($ideal-$radius); $x -lt [int]($ideal+$radius); $x++) {
                $score = $projection[$x]*1000 + [Math]::Abs($x-$ideal)
                if ($score -lt $bestScore) {$bestScore=$score;$best=$x}
            }
            $cuts += $best
        }
        $cuts += $source.Width
        $bounds = @()
        for ($column=0; $column -lt $columnCount; $column++) {
            $minX=$source.Width;$maxX=0;$minY=$source.Height;$maxY=0
            for ($y=$top; $y -lt $bottom; $y++) {
                for ($x=$cuts[$column]; $x -lt $cuts[$column+1]; $x++) {
                    if ($pixels[$y*$stride+$x*4+3] -gt 96) {
                        $minX=[Math]::Min($minX,$x);$maxX=[Math]::Max($maxX,$x)
                        $minY=[Math]::Min($minY,$y);$maxY=[Math]::Max($maxY,$y)
                    }
                }
            }
            if ($maxX -lt $minX) {throw "Empty sprite frame: $($spec.Names[$row]) $column"}
            $bounds += [System.Drawing.Rectangle]::new($minX,$minY,$maxX-$minX+1,$maxY-$minY+1)
        }
        if ($spec.SingleCells) {$bounds=@($bounds[$row]);$columnCount=1}
        $scale = $spec.Heights[$row]/$bounds[0].Height
        $atlas = [System.Drawing.Bitmap]::new(80*$columnCount,80,[System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
        $graphics = [System.Drawing.Graphics]::FromImage($atlas)
        $graphics.Clear([System.Drawing.Color]::Transparent)
        $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::NearestNeighbor
        $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::Half
        $frameMetadata = @()
        for ($column=0; $column -lt $columnCount; $column++) {
            $crop = $bounds[$column]
            $width = [int][Math]::Round($crop.Width*$scale)
            $height = [int][Math]::Round($crop.Height*$scale)
            if ($width -gt 78 -or $height -gt 78) {throw "Sprite exceeds its tile: $($spec.Names[$row]) $column ($width x $height)"}
            $left = $column*80+[int][Math]::Floor((80-$width)/2)
            $frameTop = 76-$height
            $destination = [System.Drawing.Rectangle]::new($left,$frameTop,$width,$height)
            $graphics.DrawImage($source,$destination,$crop,[System.Drawing.GraphicsUnit]::Pixel)
            $frameMetadata += @{width=$width;height=$height;left=$left-$column*80;top=$frameTop}
        }
        $outputPath = Join-Path $spriteDirectory ($spec.Names[$row]+'.png')
        $atlas.Save($outputPath,[System.Drawing.Imaging.ImageFormat]::Png)
        $graphics.Dispose();$atlas.Dispose()
        $manifest[$spec.Names[$row]] = @{file='assets/sprites/'+$spec.Names[$row]+'.png';frames=$columnCount;tile=80;height=$spec.Heights[$row];bounds=$frameMetadata;data='data:image/png;base64,'+[Convert]::ToBase64String([System.IO.File]::ReadAllBytes($outputPath))}
    }
    $source.Dispose()
}
$manifest | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath (Join-Path $spriteDirectory 'manifest.json') -Encoding utf8
Write-Output 'Prepared character, outfit, crystal, sword, gate, and statue pixel sprite atlases.'
