
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
            // 1. 여러 API를 동시에 호출하여 필요한 모든 데이터를 가져옵니다.
            const [baseTimetableRes, changesRes, swapsRes] = await Promise.all([
                fetch(`${this.apiBase}/schools/${school}/grades/${grade}/classes/${classNum}/timetable`),
                fetch(`${this.apiBase}/changes?change_date=${date}`),
                fetch(`${this.apiBase}/swaps?swap_date=${date}`)
            ]);

            const baseTimetableResult = await baseTimetableRes.json();
            const changesResult = await changesRes.json();
            const swapsResult = await swapsRes.json();

            if (!baseTimetableResult.success || !changesResult.success || !swapsResult.success) {
                throw new Error('Failed to fetch all necessary data.');
            }

            // 2. 프론트엔드에서 최종 시간표를 계산합니다.
            const effectiveTimetable = this.calculateEffectiveTimetable(baseTimetableResult.data, changesResult.data, swapsResult.data);

            // 3. 계산된 최종 시간표로 그리드를 다시 그립니다.
            this.buildTimetableGrid(effectiveTimetable);

        } catch (error) {
            console.error('Timetable load error:', error);
            alert('Failed to load timetable data.');
        }
    },
    calculateEffectiveTimetable(baseTimetable, changes, swaps) {
        const finalTimetableMap = new Map(baseTimetable.map(slot => [slot.id, { ...slot }]));

        // 2. 맞교환 적용
        const schoolSwaps = swaps.filter(s => s.school_id === this.selected.school);
        for (const swap of schoolSwaps) {
            const slot1 = finalTimetableMap.get(swap.timetable1_id);
            const slot2 = finalTimetableMap.get(swap.timetable2_id);
            if (slot1 && slot2) {
                const temp = { subject_id: slot1.subject_id, teacher_id: slot1.teacher_id };
                slot1.subject_id = slot2.subject_id;
                slot1.teacher_id = slot2.teacher_id;
                slot2.subject_id = temp.subject_id;
                slot2.teacher_id = temp.teacher_id;
                slot1.is_swapped = true;
                slot2.is_swapped = true;
            }
        }

        // 3. 단순 변경 적용
        const timetableIds = Array.from(finalTimetableMap.keys());
        const relevantChanges = changes.filter(c => timetableIds.includes(c.timetable_id));
        for (const change of relevantChanges) {
            const slot = finalTimetableMap.get(change.timetable_id);
            if (slot) {
                slot.subject_id = change.new_subject_id;
                slot.teacher_id = change.new_teacher_id;
                slot.is_changed = true;
                slot.reason = change.reason;
                delete slot.is_swapped;
            }
        }
        return Array.from(finalTimetableMap.values());
    },
    buildTimetableGrid(timetableData) {
        let maxPeriod = this.resources.periods.filter(p => p.school_id === this.selected.school).reduce((max, item) => Math.max(max, item.period_number), 0);
        if (maxPeriod === 0) { maxPeriod = 8; } // Default to 8 periods
        const grid = Array.from({ length: maxPeriod }, () => Array(5).fill(null));
        
        timetableData.forEach(item => {
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
            const response = await fetch(`${this.apiBase}/changes`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(this.forms.singleChange) });
            const result = await response.json();
            if (result.success) {
                alert('Change created successfully!');
                this.changeModalInstance.hide();
                this.loadTimetable(); // Refresh timetable view
            } else { alert(`Error: ${result.message}`); }
        } catch (error) { console.error('Submit error:', error); }
    },
    async createSwapChange() {
        try {
            const response = await fetch(`${this.apiBase}/swaps`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(this.forms.swapChange) });
            const result = await response.json();
            if (result.success) {
                alert('Swap created successfully!');
                this.resetForm('swapChange');
                this.loadTimetable(); // Refresh timetable view
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
