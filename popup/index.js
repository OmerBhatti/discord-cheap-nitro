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
document.querySelectorAll('.tab').forEach(tab => {
	tab.addEventListener('click', () => {
		document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
		tab.classList.add('active');
		render(tab.dataset.tab);
	});
});
function render(type) {
	const container = document.getElementById('content');
	container.innerHTML = '';

	chrome.storage.local.get({ savedEmojis: [] }, result => {
		const saved = result.savedEmojis;
		const filtered = saved.filter(item => item.startsWith(type + delimiter));

		if (!filtered.length) {
			container.innerHTML = `<p>No saved ${type}s</p>`;
			return;
		}

		filtered.forEach(item => {
			const [_, name, url] = item.split(delimiter);
			const div = document.createElement('div');
			div.addEventListener('click', () => {
				const emojiMarkdown = `[${name}](${url})`;

				navigator.clipboard
					.writeText(emojiMarkdown)
					.then(() => {
						showToast(`Copied to clipboard. Press CTRL + V to paste.`);
						window.close();
					})
					.catch(err => {
						console.error('Failed to copy: ', err);
					});
			});
			div.className = 'emoji-item';
			div.title = name.replace('Sticker, ', '');
			div.innerHTML = `<img src="${url}" alt="${name}">`;

			// Delete Button
			const deleteBtn = document.createElement('button');
			deleteBtn.innerHTML = 'X';
			deleteBtn.className = 'delete-btn';
			deleteBtn.title = 'Delete this emoji';
			deleteBtn.addEventListener('click', e => {
				e.stopPropagation(); // So clicking delete doesn't trigger copy
				chrome.storage.local.get({ savedEmojis: [] }, result => {
					const updated = result.savedEmojis.filter(i => i !== item);
					chrome.storage.local.set({ savedEmojis: updated }, () => {
						console.log(`Deleted: ${name}`);
						render(type); // Re-render after deletion
					});
				});
			});

			div.appendChild(deleteBtn);
			container.appendChild(div);
		});
	});
}

// default render
render('emoji');
