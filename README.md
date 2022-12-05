# ChatGPT export to PNG / PDF / HTML
> A Chrome extension for downloading your ChatGPT history to PNG, PDF or creating a sharable link
<br/>

![gpt4](https://user-images.githubusercontent.com/7003853/205509643-2283f0fe-3643-4b74-98f6-a0f2489d75ef.gif)

## Why did I build it
When you want to share some of your chats, it's very difficult to snapshot the entire chat. This will add the functionality of exporting it to an image, a PDF file, or create a sharable link.

## How to install it

To install ChatGPT Export, follow these steps:

1. Download the latest release of the extension from the [releases page](https://github.com/liady/ChatGPT-pdf/releases) on GitHub.
2. Unzip the downloaded file to extract the extension files.
3. In Google Chrome, open the Extensions page (chrome://extensions/).
4. Enable Developer mode by clicking the toggle switch in the top right corner of the page.
5. Click the `Load unpacked` button and select the directory where you unzipped the extension files.
6. ChatGPT Export should now be installed and active on the ChatGPT website (https://chat.openai.com/chat).

## How to use it

After chatting with ChatGPT, you will notice new buttons at the bottom of the page (next to "Try Again"):
<br/><br/>
<img width="761" alt="image" src="https://user-images.githubusercontent.com/7003853/205524669-6e40f151-d544-4054-a9e5-c05f3dec57a2.png">
<img width="922" alt="image" src="https://user-images.githubusercontent.com/7003853/205524690-d2facc95-56ee-43ed-9413-be200f4f57b3.png">

Click them to generate a PNG, download a PDF or create a HTML of the entire chat:
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
