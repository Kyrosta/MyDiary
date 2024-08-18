document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showDiary();
            loadEntries(username);
        } else {
            alert(data.message);
        }
    });
});

document.getElementById('signup-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;

    fetch('/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Account created! You can now log in.');
        } else {
            alert(data.message);
        }
    });
});

document.getElementById('post-entry').addEventListener('click', function () {
    const entry = document.getElementById('diary-entry').value;
    const dateTime = new Date().toLocaleString();

    fetch('/post-entry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entry, dateTime })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const listItem = document.createElement('li');
            listItem.textContent = `${dateTime}: ${entry}`;
            document.getElementById('entries-list').appendChild(listItem);
            document.getElementById('diary-entry').value = '';
        } else {
            alert(data.message);
        }
    });
});

function showDiary() {
    document.getElementById('auth-container').style.display = 'none';
    document.getElementById('diary-container').style.display = 'block';
}

function loadEntries(username) {
    fetch(`/entries?username=${username}`)
        .then(response => response.json())
        .then(entries => {
            const entriesList = document.getElementById('entries-list');
            entriesList.innerHTML = '';
            entries.forEach(entry => {
                const listItem = document.createElement('li');
                listItem.textContent = `${entry.dateTime}: ${entry.content}`;
                entriesList.appendChild(listItem);
            });
        });
}
