document.addEventListener('DOMContentLoaded', function() {
    const tryItOutButtonSelector = '.opblock-body .try-out button';
    const executeButtonSelector = '.opblock-body .btn.execute';

    // Function to handle Google login button click
    function handleGoogleLoginClick(event) {
        const operationBlock = event.target.closest('.opblock');
        if (!operationBlock) return;

        const path = operationBlock.querySelector('.opblock-summary-path').textContent.trim();
        const method = operationBlock.querySelector('.opblock-summary-method').textContent.trim();

        if (path.includes('/api/auth/login-google') && method.toUpperCase() === 'GET') {
            event.preventDefault(); // Prevent default Swagger UI AJAX request
            event.stopPropagation(); // Stop propagation to avoid other handlers

            const googleAuthUrl = 'http://localhost:4458/api/auth/login-google';
            // const googleAuthUrl = 'http://cinezone:4458/api/auth/login-google';

            window.location.href = googleAuthUrl; // Redirect the browser
        }
    }

    // Attach event listeners to future "Try it out" and "Execute" buttons
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) { // Element node
                        // Check for newly added "Try it out" buttons
                        node.querySelectorAll(tryItOutButtonSelector).forEach(button => {
                            button.removeEventListener('click', handleGoogleLoginClick); // Avoid double-binding
                            button.addEventListener('click', handleGoogleLoginClick);
                        });
                        // Check for newly added "Execute" buttons
                        node.querySelectorAll(executeButtonSelector).forEach(button => {
                            button.removeEventListener('click', handleGoogleLoginClick); // Avoid double-binding
                            button.addEventListener('click', handleGoogleLoginClick);
                        });
                    }
                });
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Also attach to any existing buttons on initial load
    document.querySelectorAll(tryItOutButtonSelector).forEach(button => {
        button.addEventListener('click', handleGoogleLoginClick);
    });
    document.querySelectorAll(executeButtonSelector).forEach(button => {
        button.addEventListener('click', handleGoogleLoginClick);
    });
}); 