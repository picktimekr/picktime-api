
const app = new Vue({
  el: '#app',
  data: {
    apiBase: '/api',
    activeTab: 'Schools',
    tabs: ['Schools', 'Teachers', 'Subjects', 'Periods', 'Timetables', 'Timetable View'],
    resources: { schools: [], teachers: [], subjects: [], periods: [], timetables: [] },
    selected: { school: null, grade: null, class: null, timetableSlot: null, date: new Date().toISOString().split('T')[0] },
    timetableGrid: [],
    weekdays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    forms: {
        school: { id: null, name: '', code: '', region: '', type: '', max_grade: null, max_real_class: null, max_virtual_class: null },
        teacher: { id: null, name: '', code: '', school_id: null },
        subject: { id: null, name: '', short_name: '', code: '', school_id: null },
        period: { id: null, school_id: null, weekday: null, period_number: null, start_time: '', end_time: '' },
        timetable: { id: null, school_id: null, grade: null, class_number: null, weekday: null, period_number: null, subject_id: null, teacher_id: null },
        singleChange: { timetable_id: null, change_date: '', new_subject_id: null, new_teacher_id: null, reason: '', created_by: 1 },
        swapChange: { school_id: null, swap_date: '', timetable1_id: null, timetable2_id: null, reason: '', created_by: 1 },
    },
    changeModalInstance: null,
  },
  computed: {
    schoolGrades() {
        if (!this.selected.school) return [];
        const school = this.resources.schools.find(s => s.id === this.selected.school);
        return school ? Array.from({ length: school.max_grade }, (_, i) => i + 1) : [];
    },
    schoolClasses() {
        if (!this.selected.school) return [];
        const school = this.resources.schools.find(s => s.id === this.selected.school);
        return school ? Array.from({ length: school.max_real_class }, (_, i) => i + 1) : [];
    }
  },
  methods: {
    async fetchAll() {
        const resourcesToFetch = ['schools', 'teachers', 'subjects', 'periods', 'timetables'];
        for (const resource of resourcesToFetch) {
            await this.fetchData(resource);
        }
    },
    async fetchData(resourceName) {
      try {
        const response = await fetch(`${this.apiBase}/${resourceName}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const result = await response.json();
        if (result.success) { this.resources[resourceName] = result.data; }
        else { alert(`Error fetching ${resourceName}: ${result.message}`); }
      } catch (error) { console.error(`Fetch error for ${resourceName}:`, error); }
    },
    async loadTimetable() {
        if (!this.selected.school || !this.selected.grade || !this.selected.class || !this.selected.date) return;
        const { school, grade, 'class': classNum, date } = this.selected;
        try {
            const url = `${this.apiBase}/schools/${school}/grades/${grade}/classes/${classNum}/timetable?date=${date}`;
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const result = await response.json();
            if (result.success) {
                this.resources.timetables = result.data;
                this.buildTimetableGrid();
            } else { alert(`Error loading timetable: ${result.message}`); }
        } catch (error) { console.error('Timetable load error:', error); }
    },
    buildTimetableGrid() {
        let maxPeriod = this.resources.periods.filter(p => p.school_id === this.selected.school).reduce((max, item) => Math.max(max, item.period_number), 0);
        if (maxPeriod === 0) { maxPeriod = 8; } // Default to 8 periods
        const grid = Array.from({ length: maxPeriod }, () => Array(5).fill(null));
        this.resources.timetables.forEach(item => {
            if (item.weekday >= 1 && item.weekday <= 5 && item.period_number >= 1 && item.period_number <= maxPeriod) {
                grid[item.period_number - 1][item.weekday - 1] = item;
            }
        });
        this.timetableGrid = grid;
    },

    // --- UI Interaction ---
    onSchoolChange() {
        this.selected.grade = null;
        this.selected.class = null;
        this.timetableGrid = [];
    },
    openChangeModal(cell) {
        this.forms.singleChange = { timetable_id: null, change_date: new Date().toISOString().split('T')[0], new_subject_id: null, new_teacher_id: null, reason: '', created_by: 1 };
        if (cell) { // Existing class
            this.selected.timetableSlot = cell;
            this.forms.singleChange.timetable_id = cell.id;
        } else { 
            this.selected.timetableSlot = null;
            return;
        }
        this.changeModalInstance.show();
    },
    async createSingleChange() {
        try {
            const response = await fetch(`${this.apiBase}/changes/single`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(this.forms.singleChange) });
            const result = await response.json();
            if (result.success) {
                alert('Change created successfully!');
                this.changeModalInstance.hide();
            } else { alert(`Error: ${result.message}`); }
        } catch (error) { console.error('Submit error:', error); }
    },
    async createSwapChange() {
        try {
            const response = await fetch(`${this.apiBase}/changes/swap`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(this.forms.swapChange) });
            const result = await response.json();
            if (result.success) {
                alert('Swap created successfully!');
                this.resetForm('swapChange');
            } else { alert(`Error: ${result.message}`); }
        } catch (error) { console.error('Submit error:', error); }
    },
    getRefName(resource, id) {
        if (!this.resources[resource]) return '?';
        const item = this.resources[resource].find(r => r.id === id);
        return item ? item.name : 'Unknown';
    },
    editResource(formName, resource) { this.forms[formName] = JSON.parse(JSON.stringify(resource)); },
    resetForm(formName) {
        const initialForms = {
            school: { id: null, name: '', code: '', region: '', type: '', max_grade: null, max_real_class: null, max_virtual_class: null },
            teacher: { id: null, name: '', code: '', school_id: null },
            subject: { id: null, name: '', short_name: '', code: '', school_id: null },
            period: { id: null, school_id: null, weekday: null, period_number: null, start_time: '', end_time: '' },
            timetable: { id: null, school_id: null, grade: null, class_number: null, weekday: null, period_number: null, subject_id: null, teacher_id: null },
            swapChange: { school_id: null, swap_date: '', timetable1_id: null, timetable2_id: null, reason: '', created_by: 1 },
        };
        if (initialForms[formName]) { this.forms[formName] = initialForms[formName]; }
    },
    async saveResource(formName, resourceName) {
        const form = this.forms[formName];
        if (!form) return;
        const method = form.id ? 'PATCH' : 'POST';
        const url = form.id ? `${this.apiBase}/${resourceName}/${form.id}` : `${this.apiBase}/${resourceName}`;
        let body = { ...form };
        if (!form.id) { delete body.id; }
        try {
            const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
            const result = await response.json();
            if (result.success) {
                this.resetForm(formName);
                this.fetchAll();
            } else { alert(`Error saving: ${result.message}`); }
        } catch (error) { console.error(`Save error for ${resourceName}:`, error); }
    },
     async deleteResource(resourceName, id) {
        if (!confirm(`Delete item ${id} from ${resourceName}?`)) return;
        try {
          const response = await fetch(`${this.apiBase}/${resourceName}/${id}`, { method: 'DELETE' });
          if (response.ok) { this.fetchAll(); }
          else { const result = await response.json(); alert(`Error: ${result.message}`); }
        } catch (error) { console.error(`Delete error:`, error); }
      },
  },
  mounted() {
    this.fetchAll();
    this.changeModalInstance = new bootstrap.Modal(document.getElementById('changeModal'));
  }
});
