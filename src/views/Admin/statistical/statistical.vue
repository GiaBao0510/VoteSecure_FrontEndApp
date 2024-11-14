<template>
    <div class="container-fluid">
      <!-- Header -->
      <ComponnetTitle :ComponnetName="ComponnetName" />
  
      <!-- Year Selector -->
      <div class="mb-4">
        <YearSelector :selectedYear="YearSelected" @yearSelected="onYearSelected" />
      </div>
  
      <!-- Statistics Cards -->
      <div class="row">
        <!-- Election Statistics -->
        <div class="col-md-6 col-lg-3 mb-4">
          <div class="card h-100 text-white bg-primary">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <i class="bi bi-bar-chart-fill display-4 me-3"></i>
                <div>
                  <h5 class="card-title">Kỳ Bầu Cử</h5>
                  <p class="card-text fs-4 mb-0">{{ formattedCount(CountElectionsInYear) }}</p>
                  <small>Đã công bố: {{ formattedCount(NumberOfElectionsWithAnnouncedResultsBasedOnYear) }}</small>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Participant Statistics -->
        <div class="col-md-6 col-lg-3 mb-4">
          <div class="card h-100 text-white bg-success">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <i class="bi bi-people-fill display-4 me-3"></i>
                <div>
                  <h5 class="card-title">Người Tham Gia</h5>
                  <p class="card-text fs-5 mb-0">Cử tri: {{ formattedCount(NumberOfVotersParticipatingInElectionsByYear) }}</p>
                  <p class="card-text fs-5 mb-0">Ứng cử viên: {{ formattedCount(NumberOfCandidatesParticipatingInElectionsByYear) }}</p>
                  <p class="card-text fs-5 mb-0">Cán bộ: {{ formattedCount(NumberOfCadresParticipatingInElectionsByYear) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <!-- System Statistics -->
        <div class="col-md-6 col-lg-3 mb-4">
          <div class="card h-100 text-white bg-warning">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <i class="bi bi-shield-lock-fill display-4 me-3"></i>
                <div>
                  <h5 class="card-title">Hệ Thống</h5>
                  <p class="card-text fs-5 mb-0">Tài khoản bị khóa: {{ formattedCount(CountLockedAccounts) }}</p>
                  <p class="card-text fs-5 mb-0">Đơn vị bầu cử: {{ formattedCount(NumberOfConstituencies) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Other Statistics -->
        <div class="col-md-6 col-lg-3 mb-4">
          <div class="card h-100 text-white bg-info">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <i class="bi bi-grid-fill display-4 me-3"></i>
                <div>
                  <h5 class="card-title">Thống Kê Khác</h5>
                  <p class="card-text fs-5 mb-0">Danh mục ứng cử: {{ formattedCount(NumberOfNominations) }}</p>
                  <p class="card-text fs-5 mb-0">Chức vụ: {{ formattedCount(NumberOfPositions) }}</p>
                  <p class="card-text fs-5 mb-0">Ban: {{ formattedCount(NumberOfBoards) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Loading Spinner -->
      <div v-if="isLoading" class="text-center my-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Đang tải...</span>
        </div>
      </div>
  
      <!-- Error Message -->
      <div v-if="error" class="alert alert-danger" role="alert">
        {{ error }}
      </div>
  
    </div>
  </template>
  
  <script>
  import api from '@/services/api.service';
  import ComponnetTitle from '../ComponnetTitle.vue';
  import YearSelector from '@/components/common/yearSelector.vue';
  
  export default {
    name: 'Statistical',
    components: {
      ComponnetTitle,
      YearSelector
    },
    props: {
      ComponnetName: {
        type: String,
        default: 'Thống kê'
      },
    },
    data() {
      return {
        CountElectionsInYear: 0,
        NumberOfVotersParticipatingInElectionsByYear: 0,
        NumberOfCandidatesParticipatingInElectionsByYear: 0,
        NumberOfCadresParticipatingInElectionsByYear: 0,
        NumberOfElectionsWithAnnouncedResultsBasedOnYear: 0,
        CountLockedAccounts: 0,
        NumberOfConstituencies: 0,
        NumberOfNominations: 0,
        NumberOfPositions: 0,
        NumberOfBoards: 0,
        YearSelected: new Date().getFullYear(),
        isLoading: false,
        error: null
      };
    },
    computed: {
      formattedCount() {
        return (value) => value?.toLocaleString() || '0';
      }
    },
    async created() {
      await this.fetchAllData();
    },
    methods: {
      async onYearSelected(year) {
        this.YearSelected = year;
        await this.fetchAllData();
      },
      async fetchAllData() {
        this.isLoading = true;
        this.error = null;
        try {
          const yearlyStats = [
            this.fetchData('CountElectionsInYear', `${import.meta.env.VITE_CountElectionsInYear_API}${this.YearSelected}`),
            this.fetchData('NumberOfVotersParticipatingInElectionsByYear', `${import.meta.env.VITE_NumberOfVotersParticipatingInElectionsByYear_API}${this.YearSelected}`),
            this.fetchData('NumberOfCandidatesParticipatingInElectionsByYear', `${import.meta.env.VITE_NumberOfCandidatesParticipatingInElectionsByYear_API}${this.YearSelected}`),
            this.fetchData('NumberOfCadresParticipatingInElectionsByYear', `${import.meta.env.VITE_NumberOfCadresParticipatingInElectionsByYear_API}${this.YearSelected}`),
            this.fetchData('NumberOfElectionsWithAnnouncedResultsBasedOnYear', `${import.meta.env.VITE_NumberOfElectionsWithAnnouncedResultsBasedOnYear_API}${this.YearSelected}`)
          ];
  
          const generalStats = [
            this.fetchData('CountLockedAccounts', import.meta.env.VITE_CountLockedAccounts_API),
            this.fetchData('NumberOfConstituencies', import.meta.env.VITE_NumberOfConstituencies_API),
            this.fetchData('NumberOfNominations', import.meta.env.VITE_NumberOfNominations_API),
            this.fetchData('NumberOfPositions', import.meta.env.VITE_NumberOfPositions_API),
            this.fetchData('NumberOfBoards', import.meta.env.VITE_NumberOfBoards_API)
          ];
  
          await Promise.all([...yearlyStats, ...generalStats]);
        } catch (error) {
          console.error('Error fetching statistics:', error);
          this.error = 'Đã xảy ra lỗi khi tải dữ liệu';
        } finally {
          this.isLoading = false;
        }
      },
      async fetchData(property, apiUrl) {
        try {
          const res = await api.get(apiUrl);
          if (res.status === 200) {
            this[property] = res.data.data.count;
          } else if (res.status === 401) {
            this.$router.push('/login');
          }
        } catch (error) {
          console.error(`Error fetching ${property}:`, error);
          throw error;
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .card {
    border: none;
    border-radius: 0.5rem;
  }
  .card .card-title {
    font-size: 1.2rem;
  }
  .card .card-text {
    font-size: 1.5rem;
  }
  .card i {
    font-size: 3rem;
  }
  </style>