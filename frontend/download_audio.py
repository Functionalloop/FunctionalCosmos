import urllib.request
import re
import os

os.makedirs('public/audio', exist_ok=True)

url = 'https://pixabay.com/sound-effects/musical-wandering-6394/'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'})
try:
    html = urllib.request.urlopen(req).read().decode('utf-8')
    match = re.search(r'\"contentUrl\":\"(https://cdn\.pixabay\.com/audio[^\"]+\.mp3)\"', html)
    if match:
        mp3_url = match.group(1)
        print('Found MP3 URL:', mp3_url)
        urllib.request.urlretrieve(mp3_url, 'public/audio/ambient.mp3')
        print('Downloaded ambient.mp3')
    else:
        # Fallback to a known direct link if the regex fails
        print('No MP3 URL found, looking for alternative tags...')
        # Try finding standard audio tags
        match2 = re.search(r'src="(https://cdn\.pixabay\.com/audio[^\"]+\.mp3)"', html)
        if match2:
            print('Found MP3 URL:', match2.group(1))
            urllib.request.urlretrieve(match2.group(1), 'public/audio/ambient.mp3')
            print('Downloaded ambient.mp3')
        else:
            print('Failed to find audio URL.')
except Exception as e:
    print('Error:', e)
