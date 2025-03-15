// Helper function to display messages
function displayMessage(elementId, message) {
  document.getElementById(elementId).innerText = message;
}

// REGISTER USER
document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const role = document.getElementById('role') ? document.getElementById('role').value : 'user';
  try {
    const res = await fetch('/api/user/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, role })
    });
    const data = await res.json();
    displayMessage('message', data.message || data.error);
  } catch (err) {
    displayMessage('message', 'Error registering user');
  }
});

// LOGIN USER
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;
  try {
    const res = await fetch('/api/user/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    displayMessage('loginMessage', data.message || data.error);
    if (data.userId) {
      localStorage.setItem('userId', data.userId);
      localStorage.setItem('role', data.role);
    }
  } catch (err) {
    displayMessage('loginMessage', 'Error logging in');
  }
});

// FETCH CANDIDATES FOR VOTING
if (document.getElementById('candidateList')) {
  fetch('/api/candidate')
    .then(response => response.json())
    .then(candidates => {
      const listDiv = document.getElementById('candidateList');
      if (candidates.length === 0) {
        listDiv.innerHTML = '<p>No candidates available.</p>';
      } else {
        listDiv.innerHTML = candidates.map(candidate => 
          `<p>ID: ${candidate._id} | Name: ${candidate.name} | Party: ${candidate.party || 'N/A'} | Votes: ${candidate.votes}</p>`
        ).join('');
      }
    })
    .catch(err => console.error('Error fetching candidates:', err));
}

// VOTE FOR A CANDIDATE
document.getElementById('voteForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const candidateId = document.getElementById('candidateId').value;
  const voterId = localStorage.getItem('userId');
  if (!voterId) {
    return displayMessage('voteMessage', 'You must be logged in to vote.');
  }
  try {
    const res = await fetch('/api/candidate/vote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ candidateId, userId: voterId })
    });
    const data = await res.json();
    displayMessage('voteMessage', data.message || data.error);
  } catch (err) {
    displayMessage('voteMessage', 'Error casting vote');
  }
});

// ADMIN: ADD CANDIDATE
document.getElementById('addCandidateForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const candidateName = document.getElementById('candidateName').value;
  const candidateParty = document.getElementById('candidateParty').value;
  try {
    const res = await fetch('/api/candidate/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: candidateName, party: candidateParty })
    });
    const data = await res.json();
    displayMessage('adminMessage', data.message || data.error);
  } catch (err) {
    displayMessage('adminMessage', 'Error adding candidate');
  }
});

// RESULTS PAGE: Fetch candidates and render a chart
if (document.getElementById('resultsChart')) {
  fetch('/api/candidate/results')
    .then(response => response.json())
    .then(candidates => {
      const labels = candidates.map(c => c.name);
      const votes = candidates.map(c => c.votes);
      const ctx = document.getElementById('resultsChart').getContext('2d');
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Votes',
            data: votes,
            backgroundColor: 'rgba(54, 162, 235, 0.6)'
          }]
        },
        options: {
          responsive: true,
          scales: {
            yAxes: [{ ticks: { beginAtZero: true } }]
          }
        }
      });
      const listDiv = document.getElementById('resultsList');
      listDiv.innerHTML = candidates.map(candidate => 
        `<p>${candidate.name} (${candidate.party || 'N/A'}) - Votes: ${candidate.votes}</p>`
      ).join('');
    })
    .catch(err => console.error('Error fetching results:', err));
}
