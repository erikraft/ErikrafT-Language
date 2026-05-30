document.addEventListener('DOMContentLoaded', () => {
    // Tab switching for code editors
    const tabs = document.querySelectorAll('.editor-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const parent = tab.closest('.editor-tabs');
            parent.querySelectorAll('.editor-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        });
    });

    // Mock search focus
    const searchBar = document.querySelector('.search-bar');
    if (searchBar) {
        searchBar.addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = 'Search docs...';
            input.style.background = 'transparent';
            input.style.border = 'none';
            input.style.color = 'white';
            input.style.outline = 'none';
            input.style.width = '100%';

            const span = searchBar.querySelector('span');
            if (span && span.textContent === 'Search docs...') {
                searchBar.innerHTML = '';
                searchBar.appendChild(input);
                input.focus();
            }
        });
    }

    // Copy code buttons
    document.querySelectorAll('.editor-container').forEach(container => {
        const header = container.querySelector('.editor-header');
        if (header) {
            const copyBtn = document.createElement('div');
            copyBtn.className = 'btn btn-ghost';
            copyBtn.style.fontSize = '0.75rem';
            copyBtn.style.padding = 'var(--space-1) var(--space-3)';
            copyBtn.textContent = 'Copy';
            copyBtn.addEventListener('click', () => {
                const code = container.querySelector('.code-content')?.innerText;
                if (code) {
                    navigator.clipboard.writeText(code);
                    copyBtn.textContent = 'Copied!';
                    setTimeout(() => copyBtn.textContent = 'Copy', 2000);
                }
            });
            header.appendChild(copyBtn);
        }
    });
});
