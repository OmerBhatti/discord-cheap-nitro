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
						console.log(`Copied: ${name}`);
						chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
							chrome.tabs.sendMessage(tabs[0].id, {
								action: 'insertMarkdown',
								payload: emojiMarkdown,
							});
						});
						window.close();
					})
					.catch(err => {
						console.error('Failed to copy: ', err);
					});
			});
			div.className = 'emoji-item';
			div.innerHTML = `<img src="${url}" alt="${name}">`;
			container.appendChild(div);
		});
	});
}

// default render
render('emoji');
