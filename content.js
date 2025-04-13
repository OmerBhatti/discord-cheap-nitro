// Utils
function showToast(message) {
	const toast = document.createElement('div');
	toast.innerText = message;
	toast.style.position = 'fixed';
	toast.style.top = '20px';
	toast.style.right = '20px';
	toast.style.background = '#333';
	toast.style.color = '#fff';
	toast.style.padding = '10px 15px';
	toast.style.borderRadius = '8px';
	toast.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
	toast.style.zIndex = 9999999;
	toast.style.opacity = '0';
	toast.style.transition = 'opacity 0.3s ease';

	document.body.appendChild(toast);

	// Animate in
	requestAnimationFrame(() => {
		toast.style.opacity = '1';
	});

	// Remove after 3 seconds
	setTimeout(() => {
		toast.style.opacity = '0';
		setTimeout(() => {
			toast.remove();
		}, 300);
	}, 3000);
}

// Actual Code
const delimiter = '][';
function addDownloadButtons() {
	document.querySelectorAll('img').forEach(img => {
		if (
			(img.alt?.startsWith(':') || img.alt.startsWith('Sticker,')) &&
			(img.src?.includes('emoji') || img.src.includes('sticker')) &&
			!img.parentElement.querySelector('.cheap-nitro-downloader-btn')
		) {
            let type = "emoji"
            if (img.src.includes('sticker')) {
                type = "sticker"
            }

			const btn = document.createElement('button');
			btn.textContent = '⬇️';
			btn.className = 'cheap-nitro-downloader-btn';
            
            btn.style.visibility = 'hidden';
            img.onmouseenter = () => {
                btn.style.visibility = 'visible';
            }
            btn.onmouseenter = () => {
                btn.style.visibility = 'visible';
            }
            btn.onmouseleave = () => {
                btn.style.visibility = 'hidden';
            }
            img.onmouseleave = () => {
                btn.style.visibility = 'hidden';
            }

			btn.onclick = event => {
                event.stopPropagation();

				const name = img.alt;
				const emojiUrl = img.src;
				const dta = `${type}${delimiter}${name}${delimiter}${emojiUrl}`;

				chrome.storage.local.get({ savedEmojis: [] }, result => {
					let saved = result.savedEmojis;
					if (!saved.includes(dta)) {
						saved.push(dta);
						chrome.storage.local.set({ savedEmojis: saved }, () => {
							showToast(`${type} saved in extension!`);
						});
					}
                    else {
                        showToast(`Already saved`);
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
