<template>
  <div class="year-selector-container">
    <div class="year-selector-scroll">
      <div class="btn-group d-flex flex-nowrap">
        <button
          v-for="year in years"
          :key="year"
          type="button"
          class="btn year-btn"
          :class="{
            'btn-primary': selectedYear === year,
            'btn-outline-primary': selectedYear !== year
          }"
          @click="selectYear(year)"
        >
          {{ year }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'YearSelector',
  props: {
    selectedYear: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      years: this.generateYears()
    };
  },
  methods: {
    generateYears() {
      const currentYear = new Date().getFullYear();
      return Array.from({ length: 10 }, (_, i) => currentYear + i - 3);
    },
    selectYear(year) {
      this.$emit('yearSelected', year);
    }
  }
};
</script>

<style scoped>
.year-selector-container {
  width: 100%;
  position: relative;
  min-width: 150px; /* Kích thước tối thiểu */
}

.year-selector-scroll {
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch; /* Cho iOS scroll mượt */
  scrollbar-width: thin; /* Firefox */
  ms-overflow-style: -ms-autohiding-scrollbar; /* IE/Edge */
}

/* Tùy chỉnh thanh cuộn cho Webkit browsers */
.year-selector-scroll::-webkit-scrollbar {
  height: 4px;
}

.year-selector-scroll::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2px;
}

.year-selector-scroll::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 2px;
}

.year-selector-scroll::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.btn-group {
  min-width: min-content;
  padding: 2px;
}

.year-btn {
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
  min-width: 70px; /* Kích thước tối thiểu cho mỗi nút */
  flex: 0 0 auto;
  text-align: center;
  white-space: nowrap;
  border: 1px solid #dee2e6;
  transition: all 0.2s ease-in-out;
}

.year-btn:first-child {
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
}

.year-btn:last-child {
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
}

/* Responsive styles */
@media (max-width: 768px) {
  .year-btn {
    min-width: 60px;
    padding: 0.25rem 0.5rem;
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .year-selector-container {
    min-width: 120px;
  }
  
  .year-btn {
    min-width: 50px;
    padding: 0.2rem 0.4rem;
    font-size: 0.75rem;
  }
}

/* Loại bỏ các khoảng trống không cần thiết trong btn-group */
.btn-group {
  gap: 0;
}

/* Animation khi scroll */
.year-selector-scroll {
  scroll-behavior: smooth;
}
</style>