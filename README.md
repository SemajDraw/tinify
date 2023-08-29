## tinify - a simple script to compress images

####

Input and output paths must be absolute

Get a tinypng api key [here](https://tinypng.com/developers)

You must specify a different output directory if you do not want the original file/s to be overwritten

### Commands

```
Single file
$ node compress.js \
  --k YOUR_API_KEY \
  --f example.jpg \
  --i /path/to/input/directory \
  --o /path/to/output/directory/compressed \
  --e false

Entire Directory - supported extensions (jpg | jpeg | png | svg | webp | ico | tiff | tif)
$ node compress.js \
  --k YOUR_API_KEY \
  --i /path/to/input/directory \
  --o /path/to/output/directory/compressed \
  --e true
```
