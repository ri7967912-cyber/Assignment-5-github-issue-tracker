const MOCK_ISSUES = [
  {
    id: 1,
    title: 'Fix Navigation Menu On Mobile Devices',
    description: 'The navigation menu doesn\'t collapse properly on mobile devices. Need to fix the responsive behavior.',
    status: 'open',
    author: 'jhn_doe',
    priority: 'HIGH',
    labels: ['bug', 'mobile'],
    created_at: '2024-01-15T10:00:00Z'
  },
  {
    id: 2,
    title: 'Fix Navigation Menu On Mobile Devices',
    description: 'The navigation menu doesn\'t collapse properly on mobile devices. Need to fix the responsive behavior.',
    status: 'closed',
    author: 'jane_smith',
    priority: 'MEDIUM',
    labels: ['bug'],
    created_at: '2024-01-20T14:30:00Z'
  },
  {
    id: 3,
    title: 'Add dark mode support',
    description: 'Implement theme toggle and persist user preference.',
    status: 'closed',
    author: 'mike_dev',
    priority: 'LOW',
    labels: ['feature'],
    created_at: '2024-01-10T08:15:00Z'
  },
  {
    id: 4,
    title: 'Login page validation',
    description: 'Show inline errors when fields are empty or credentials are wrong.',
    status: 'open',
    author: 'sarah_ux',
    priority: 'MEDIUM',
    labels: ['ui', 'bug'],
    created_at: '2024-01-18T12:00:00Z'
  },
  {
    id: 5,
    title: 'API integration timeout',
    description: 'Increase timeout for slow networks and show loading state.',
    status: 'open',
    author: 'dev_ops',
    priority: 'HIGH',
    labels: ['performance'],
    created_at: '2024-01-22T09:45:00Z'
  },
  {
    id: 6,
    title: 'Update documentation',
    description: 'Add setup instructions and API reference to README.',
    status: 'closed',
    author: 'docs_team',
    priority: 'LOW',
    labels: ['documentation'],
    created_at: '2024-01-05T16:20:00Z'
  }
];

// ---------- state ----------
let allIssues = [];
let currentFilter = 'all';

// DOM elements
const issuesGrid = document.getElementById('issuesGrid');
const loadingSpinner = document.getElementById('loadingSpinner');
const issueCountSpan = document.getElementById('issueCount');
const openCountSpan = document.getElementById('openCount');
const closedCountSpan = document.getElementById('closedCount');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const modalOverlay = document.getElementById('modalOverlay');
const closeModalBtn = document.getElementById('closeModalBtn');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');

// tabs
const tabAll = document.getElementById('tabAll');
const tabOpen = document.getElementById('tabOpen');
const tabClosed = document.getElementById('tabClosed');
const tabBtns = document.querySelectorAll('.tab-btn');

// ---------- helpers ----------
function showLoading(show) {
  loadingSpinner.classList.toggle('hidden', !show);
  if (show) issuesGrid.innerHTML = '';
}

function updateStats() {
  if (!allIssues.length) {
    issueCountSpan.innerText = '0 issues';
    openCountSpan.innerText = '0';
    closedCountSpan.innerText = '0';
    return;
  }
  const open = allIssues.filter(iss => iss.status === 'open').length;
  const closed = allIssues.filter(iss => iss.status === 'closed').length;
  openCountSpan.innerText = open;
  closedCountSpan.innerText = closed;
  let filteredCount = allIssues.length;
  if (currentFilter === 'open') filteredCount = open;
  else if (currentFilter === 'closed') filteredCount = closed;
  issueCountSpan.innerText = `${filteredCount} issue${filteredCount !== 1 ? 's' : ''}`;
}

function setActiveTab(tabId) {
  tabBtns.forEach(btn => btn.classList.remove('tab-active', 'bg-[#E4E4E7]'));
  if (tabId === 'all') tabAll.classList.add('tab-active', 'bg-[#E4E4E7]');
  if (tabId === 'open') tabOpen.classList.add('tab-active', 'bg-[#E4E4E7]');
  if (tabId === 'closed') tabClosed.classList.add('tab-active', 'bg-[#E4E4E7]');
  currentFilter = tabId;
}

function renderIssues(issuesArray = allIssues) {
  let filtered = issuesArray;
  if (currentFilter === 'open') {
    filtered = issuesArray.filter(iss => iss.status === 'open');
  } else if (currentFilter === 'closed') {
    filtered = issuesArray.filter(iss => iss.status === 'closed');
  }

  if (!filtered.length) {
    issuesGrid.innerHTML = `<div class="col-span-full text-center py-16 text-[#64748B] bg-white rounded-lg border border-dashed">✨ No issues to show</div>`;
    updateStats();
    return;
  }

  let htmlStr = '';
  filtered.forEach(iss => {
    const topBorderClass = iss.status === 'open' ? 'card-top-open' : 'card-top-closed';
    let created = iss.created_at ? new Date(iss.created_at).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' }) : 'unknown';
    let desc = iss.description || iss.body || 'No description';
    if (desc.length > 85) desc = desc.slice(0,82) + '...';
    const label = iss.labels?.[0] || 'bug';
    const author = iss.author || iss.user?.login || 'unknown';

    // Colorful badge classes based on status and priority
    const statusClass = iss.status === 'open' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-purple-100 text-purple-800';
    
    let priorityClass = '';
    const pri = (iss.priority || 'medium').toLowerCase();
    if (pri === 'high') priorityClass = 'bg-red-100 text-red-800';
    else if (pri === 'medium') priorityClass = 'bg-yellow-100 text-yellow-800';
    else priorityClass = 'bg-green-100 text-green-800';

    htmlStr += `
      <div class="issue-card bg-white rounded-lg border border-[#E4E4E7] shadow-sm hover:shadow-md transition cursor-pointer ${topBorderClass} p-4 flex flex-col gap-2" data-id="${iss.id}">
        <h3 class="font-semibold text-[#0A0A0A] line-clamp-2">${iss.title || 'Untitled'}</h3>
        <p class="text-xs text-[#64748B] line-clamp-2">${desc}</p>
        <div class="flex flex-wrap gap-2 mt-1 text-xs">
          <span class="${statusClass} px-2 py-0.5 rounded-full capitalize">${iss.status}</span>
          <span class="bg-[#F8FAFC] px-2 py-0.5 rounded-full">@${author}</span>
          <span class="${priorityClass} px-2 py-0.5 rounded-full capitalize">${iss.priority || 'medium'}</span>
          <span class="bg-[#F8FAFC] px-2 py-0.5 rounded-full">${label}</span>
        </div>
        <div class="text-[10px] text-[#64748B] mt-1">📅 ${created}</div>
      </div>
    `;
  });
  issuesGrid.innerHTML = htmlStr;
  updateStats();
}

// ---------- robust API fetch with fallback ----------
async function fetchAllIssues() {
  showLoading(true);
  try {
    const res = await fetch('https://phi-lab-server.vercel.app/api/v1/lab/issues');
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    
    let issuesArray = [];
    if (Array.isArray(data)) {
      issuesArray = data;
    } else if (data.issues && Array.isArray(data.issues)) {
      issuesArray = data.issues;
    } else if (data.data && Array.isArray(data.data)) {
      issuesArray = data.data;
    } else {
      console.warn('Unknown API response format, using mock data', data);
      issuesArray = [];
    }

    if (issuesArray.length === 0) {
      console.log('API returned no issues, loading mock data');
      allIssues = MOCK_ISSUES;
    } else {
      allIssues = issuesArray.map(iss => ({
        id: iss.id || Math.random(),
        title: iss.title || 'Untitled',
        description: iss.description || iss.body || '',
        status: iss.status || iss.state || 'open',
        author: iss.author || iss.user?.login || 'unknown',
        priority: iss.priority || 'medium',
        labels: iss.labels || ['bug'],
        created_at: iss.created_at || iss.created || new Date().toISOString()
      }));
    }
    renderIssues();
  } catch (err) {
    console.error('Fetch failed, using mock data', err);
    allIssues = MOCK_ISSUES;
    renderIssues();
  } finally {
    showLoading(false);
  }
}

async function performSearch(query) {
  if (!query.trim()) {
    fetchAllIssues();
    return;
  }
  showLoading(true);
  try {
    const url = `https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${encodeURIComponent(query)}`;
    const res = await fetch(url);
    const data = await res.json();
    
    let results = [];
    if (Array.isArray(data)) {
      results = data;
    } else if (data.issues && Array.isArray(data.issues)) {
      results = data.issues;
    } else {
      results = [];
    }

    if (results.length === 0) {
      // Fallback: filter mock data locally
      allIssues = MOCK_ISSUES.filter(iss => 
        iss.title.toLowerCase().includes(query.toLowerCase()) || 
        iss.description.toLowerCase().includes(query.toLowerCase())
      );
    } else {
      allIssues = results.map(iss => ({
        id: iss.id || Math.random(),
        title: iss.title || 'Untitled',
        description: iss.description || iss.body || '',
        status: iss.status || iss.state || 'open',
        author: iss.author || iss.user?.login || 'unknown',
        priority: iss.priority || 'medium',
        labels: iss.labels || ['bug'],
        created_at: iss.created_at || iss.created || new Date().toISOString()
      }));
    }
    renderIssues();
  } catch (err) {
    console.error('Search failed, filtering mock data', err);
    allIssues = MOCK_ISSUES.filter(iss => 
      iss.title.toLowerCase().includes(query.toLowerCase()) || 
      iss.description.toLowerCase().includes(query.toLowerCase())
    );
    renderIssues();
  } finally {
    showLoading(false);
  }
}

// ---------- modal ----------
function openModal(issueId) {
  const issue = allIssues.find(iss => String(iss.id) === String(issueId));
  if (!issue) return;
  modalTitle.innerText = issue.title || 'untitled';
  modalBody.innerHTML = `
    <div><span class="font-medium">Description:</span> ${issue.description || issue.body || '—'}</div>
    <div><span class="font-medium">Status:</span> <span class="capitalize">${issue.status}</span></div>
    <div><span class="font-medium">Author:</span> @${issue.author || issue.user?.login || 'unknown'}</div>
    <div><span class="font-medium">Priority:</span> ${issue.priority || 'not set'}</div>
    <div><span class="font-medium">Labels:</span> ${issue.labels ? issue.labels.join(', ') : 'none'}</div>
    <div><span class="font-medium">Created:</span> ${new Date(issue.created_at).toLocaleString()}</div>
    <div><span class="font-medium">ID:</span> ${issue.id}</div>
  `;
  modalOverlay.classList.remove('hidden');
}

// ---------- event listeners ----------
tabAll.addEventListener('click', () => { setActiveTab('all'); renderIssues(); });
tabOpen.addEventListener('click', () => { setActiveTab('open'); renderIssues(); });
tabClosed.addEventListener('click', () => { setActiveTab('closed'); renderIssues(); });

searchBtn.addEventListener('click', () => performSearch(searchInput.value));
searchInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') performSearch(searchInput.value); });

issuesGrid.addEventListener('click', (e) => {
  const card = e.target.closest('.issue-card');
  if (card) openModal(card.dataset.id);
});

closeModalBtn.addEventListener('click', () => modalOverlay.classList.add('hidden'));
modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) modalOverlay.classList.add('hidden'); });

// ---------- initialisation & auth guard ----------
if (localStorage.getItem('issuesTrackerLoggedIn') !== 'true') {
  window.location.href = 'login.html';
} else {
  setActiveTab('all');
  fetchAllIssues();
}