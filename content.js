const delimiter = '][';
function addDownloadButtons() {
	document.querySelectorAll('img').forEach(img => {
		if (
			img.alt?.startsWith(':') &&
			img.src?.includes('emoji') &&
			!img.parentElement.querySelector('.emoji-downloader-btn')
		) {
			const btn = document.createElement('button');
			btn.textContent = '⬇️';
			btn.className = 'emoji-downloader-btn';

			btn.onclick = () => {
				const name = img.alt;
				const emojiUrl = img.src;
				const dta = `emoji${delimiter}${name}${delimiter}${emojiUrl}`;

				chrome.storage.local.get({ savedEmojis: [] }, result => {
					let saved = result.savedEmojis;
					if (!saved.includes(dta)) {
						saved.push(dta);
						chrome.storage.local.set({ savedEmojis: saved }, () => {
							console.log(`Saved: ${name}`);
						});
					}
				});
			};

			img.parentElement.style.position = 'relative';
			img.parentElement.appendChild(btn);
		}
	});
}

const observer = new MutationObserver(addDownloadButtons);
observer.observe(document.body, { childList: true, subtree: true });
addDownloadButtons();
