# ChatGPT export to PNG/PDF
> A Chrome extension for downloading your ChatGPT history to PNG or PDF

## Why did I build it
When you want to share some of your chats, it's very difficult to snapshot the entire chat. This will add the functionality of exporting it to an image or a PDF file.

## How to install it

To install ChatGPT Assistant, follow these steps:

1. Download the latest release of the extension from the [releases page](https://github.com/liady/ChatGPT-pdf/releases) on GitHub.
2. Unzip the downloaded file to extract the extension files.
3. In Google Chrome, open the Extensions page (chrome://extensions/).
4. Enable Developer mode by clicking the toggle switch in the top right corner of the page.
5. Click the `Load unpacked` button and select the directory where you unzipped the extension files.
6. ChatGPT Export should now be installed and active on the ChatGPT website (https://chat.openai.com/chat).

## How to use it

After chatting with ChatGPT, you will notice two new buttons at the bottom of the page (next to "Try Again"):
<br/><br/>
<img width="603" alt="image" src="https://user-images.githubusercontent.com/7003853/205508705-f8c90359-8541-4b59-af5a-8a751833de10.png">
<img width="1241" alt="Arrows2" src="https://user-images.githubusercontent.com/7003853/205508245-27048459-6c7a-48cb-8f43-b8196fb9401b.png">

Click them to generate a PNG, or download a PDF of the entire chat:
<br/>
<center><img height="600" alt="Arrows2" src="https://user-images.githubusercontent.com/7003853/205508289-fb56f028-021e-4ca5-8dc4-a65626888760.png"></center>

## Known issues
* Image avatars might get distorted due to the use of `html2canvas`. Working on it.
* Line height might have a small offset (again, due to `html2canvas`). Working on it.

## Roadmap
* Allow exporting as text
* Allow choosing resolution / file size
* Allow splitting to smaller partial images (for Twitter, for example)

## Contribution
PRs welcome!
