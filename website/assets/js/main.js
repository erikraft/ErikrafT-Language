document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Logic
    const mobileMenuOpen = document.getElementById('mobile-menu-open');
    const mobileMenuClose = document.getElementById('mobile-menu-close');
    const mobileNav = document.getElementById('mobile-nav');
    const mobileOverlay = document.getElementById('mobile-overlay');

    if (mobileMenuOpen && mobileNav && mobileOverlay) {
        mobileMenuOpen.addEventListener('click', () => {
            mobileNav.classList.add('active');
            mobileOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        const closeMenu = () => {
            mobileNav.classList.remove('active');
            mobileOverlay.classList.remove('active');
            document.body.style.overflow = '';
        };

        mobileMenuClose.addEventListener('click', closeMenu);
        mobileOverlay.addEventListener('click', closeMenu);

        // Close menu on link click
        mobileNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        // Populate mobile nav with docs links if they exist
        const docsSidebar = document.querySelector('.docs-sidebar');
        if (docsSidebar) {
            const mobileDocsNav = document.createElement('div');
            mobileDocsNav.className = 'mobile-nav-docs';
            mobileDocsNav.style.marginTop = 'var(--space-8)';
            mobileDocsNav.style.paddingTop = 'var(--space-8)';
            mobileDocsNav.style.borderTop = '1px solid var(--border)';

            const docsContent = docsSidebar.innerHTML;
            mobileDocsNav.innerHTML = docsContent;

            // Clean up styles for mobile nav
            mobileDocsNav.querySelectorAll('.docs-nav-title').forEach(title => {
                title.style.fontSize = '0.75rem';
                title.style.marginBottom = 'var(--space-2)';
            });

            mobileNav.querySelector('.mobile-nav-links').appendChild(mobileDocsNav);

            // Add click listeners to new links
            mobileDocsNav.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', closeMenu);
            });
        }
    }

    // Active page highlighting in mobile nav
    const currentPath = window.location.pathname;
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        if (link.getAttribute('href') && currentPath.endsWith(link.getAttribute('href').replace('../', ''))) {
            link.classList.add('active');
        }
    });

    // CodeBox IDE Features
    document.querySelectorAll('.editor-container').forEach(container => {
        const tabs = container.querySelectorAll('.editor-tab');
        const runBtn = container.querySelector('.btn-ghost:last-child'); // Assuming Run is the last btn in header

        // Tab switching logic to actually switch content
        const codeContent = container.querySelector('.code-content');
        const tabContents = {
            'main.erik': 'use ai\nuse std.io\n\npub async fn main() {\n  // Treat AI as a first-class citizen\n  let response = await ai.chat("Explain ErikrafT in one sentence.")\n  io.print(response)\n\n  spawn backgroundTask()\n}',
            'ai_agent.erik': 'use ai\n\npub async fn runAgent() {\n  let agent = ai.Agent.new("Researcher")\n  agent.task("Analyze the latest trends in erikraft.")\n  let report = await agent.run()\n  return report\n}',
            'example.erik': 'pub fn main() {\n  print("Hello, ErikrafT!")\n}'
        };

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                const fileName = tab.textContent.trim();
                if (codeContent && tabContents[fileName]) {
                    codeContent.innerText = tabContents[fileName];
                    // Re-apply basic syntax highlighting if needed (simplified)
                    highlightCode(codeContent);
                }
            });
        });

        function highlightCode(element) {
            let html = element.innerText;
            html = html.replace(/\b(pub|fn|async|let|use|spawn|await|const|return)\b/g, '<span class="keyword">$1</span>');
            html = html.replace(/\b(main|chat|runAgent|new|task|run|print)\b/g, '<span class="function">$1</span>');
            html = html.replace(/(\".*?\")/g, '<span class="string">$1</span>');
            html = html.replace(/(\/\/.*?)\n/g, '<span class="comment">$1</span>\n');
            element.innerHTML = html.replace(/\n/g, '<br>').replace(/  /g, '&nbsp;&nbsp;');
        }

        // Copy button implementation
        const header = container.querySelector('.editor-header');
        if (header) {
            const copyBtn = document.createElement('button');
            copyBtn.className = 'btn btn-ghost';
            copyBtn.style.fontSize = '0.75rem';
            copyBtn.style.padding = 'var(--space-1) var(--space-3)';
            copyBtn.innerHTML = '<i class="fa-regular fa-copy"></i> Copy';

            copyBtn.addEventListener('click', () => {
                const code = container.querySelector('.code-content')?.innerText;
                if (code) {
                    navigator.clipboard.writeText(code).then(() => {
                        copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
                        setTimeout(() => {
                            copyBtn.innerHTML = '<i class="fa-regular fa-copy"></i> Copy';
                        }, 2000);
                    });
                }
            });

            // Insert before the Run button if it exists
            if (runBtn) {
                header.insertBefore(copyBtn, runBtn);
            } else {
                header.appendChild(copyBtn);
            }

            // Formatting button implementation
            const formatBtn = document.createElement('button');
            formatBtn.className = 'btn btn-ghost';
            formatBtn.style.fontSize = '0.75rem';
            formatBtn.style.padding = 'var(--space-1) var(--space-3)';
            formatBtn.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles"></i> Format';
            formatBtn.addEventListener('click', () => {
                formatBtn.innerHTML = '<i class="fa-solid fa-check"></i> Formatted';
                setTimeout(() => {
                    formatBtn.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles"></i> Format';
                }, 2000);
            });
            if (runBtn) {
                header.insertBefore(formatBtn, runBtn);
            } else {
                header.appendChild(formatBtn);
            }
        }

        // Run button simulation
        if (runBtn && runBtn.textContent.trim() === 'Run') {
            runBtn.addEventListener('click', () => {
                let outputPanel = container.querySelector('.output-panel');
                if (!outputPanel) {
                    outputPanel = document.createElement('div');
                    outputPanel.className = 'output-panel active';
                    container.appendChild(outputPanel);
                } else {
                    outputPanel.classList.toggle('active');
                }

                if (outputPanel.classList.contains('active')) {
                    outputPanel.innerHTML = '<div style="color: var(--primary)">Running main.erik...</div>' +
                                           '<div style="color: var(--text-muted)">[Process started]</div>' +
                                           '<div style="margin-top: 4px;">ErikrafT v0.1.0-alpha</div>' +
                                           '<div style="color: var(--accent)">Hello from ErikrafT!</div>' +
                                           '<div style="color: var(--text-muted); margin-top: 4px;">[Process completed with exit code 0]</div>';
                }
            });
        }
    });

    // Keyboard Shortcuts (Cmd+K)
    document.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            const query = prompt('Search ErikrafT documentation:');
            if (query) {
                console.log('Searching for:', query);
            }
        }
    });

    // Mock Search Modal
    const searchTrigger = document.getElementById('search-trigger');
    if (searchTrigger) {
        searchTrigger.addEventListener('click', () => {
            const query = prompt('Search ErikrafT documentation:');
            if (query) {
                console.log('Searching for:', query);
            }
        });
    }

    // Docs Table of Contents highlighting (Simplified)
    const tocLinks = document.querySelectorAll('.docs-toc .docs-nav-link');
    if (tocLinks.length > 0) {
        const sections = Array.from(tocLinks).map(link => {
            const id = link.getAttribute('href').substring(1);
            return document.getElementById(id);
        }).filter(s => s !== null);

        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (pageYOffset >= sectionTop - 120) {
                    current = section.getAttribute('id');
                }
            });

            tocLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href').substring(1) === current) {
                    link.classList.add('active');
                }
            });
        });
    }
});
