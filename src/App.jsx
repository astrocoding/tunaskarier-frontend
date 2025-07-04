import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardAdminPage from './pages/admin/DashboardPage';
import AdminPage from './pages/admin/AdminPage';
import AdminProfile from './pages/admin/AdminProfile';
import StudentPage from './pages/admin/StudentPage';
import StudentCreatePage from './pages/admin/StudentCreatePage';
import StudentUpdatePage from './pages/admin/StudentUpdatePage';
import StudentDetailPage from './pages/admin/StudentDetailPage';
import AdminRoute from './routes/AdminRoute';
import AdminCreatePage from './pages/admin/AdminCreatePage';
import AdminUpdatePage from './pages/admin/AdminUpdatePage';
import CompanyPage from './pages/admin/CompanyPage';
import CompanyCreatePage from './pages/admin/CompanyCreatePage';
import CompanyUpdatePage from './pages/admin/CompanyUpdatePage';
import CompanyDetailPage from './pages/admin/CompanyDetailPage';
import MentorPageAdmin from './pages/admin/MentorPage';
import MentorUpdatePageAdmin from './pages/admin/MentorUpdatePage';
import MentorDetailPageAdmin from './pages/admin/MentorDetailPage';
import ProgramPageAdmin from './pages/admin/ProgramPage';
import ProgramDetailPageAdmin from './pages/admin/ProgramDetailPage';
import ApplicationPageAdmin from './pages/admin/ApplicationPage';
import ApplicationDetailPageAdmin from './pages/admin/ApplicationDetailPage';
import CompanyRoute from './routes/CompanyRoute';
import DashboardCompanyPage from './pages/company/DashboardPage';
import CompanyProfile from './pages/company/CompanyProfile';
import MentorPage from './pages/company/MentorPage';
import MentorCreatePage from './pages/company/MentorCreatePage';
import MentorRoute from './routes/MentorRoute';
import DashboardMentorPage from './pages/mentor/DashboardPage';
import StudentRoute from './routes/StudentRoute';
import DashboardStudentPage from './pages/student/DashboardPage';
import ProgramPage from './pages/student/ProgramPage';
import ProgramDetailPage from './pages/student/ProgramDetailPage';
import MentorUpdatePage from './pages/company/MentorUpdatePage';
import ProgramCreatePage from './pages/company/ProgramCreatePage';
import ProgramUpdatePage from './pages/company/ProgramUpdatePage';
import ProgramDetail from './components/ProgramDetail';
import ApplicationPage from './pages/company/ApplicationPage';
import AppliedProgramsPage from './pages/student/AppliedProgramPage';
import MentorProfile from './pages/mentor/MentorProfile';
import MentorProgramsPage from './pages/mentor/ProgramPage';
import MentorStudentsPage from './pages/mentor/StudentPage';
import MentorStudentDetailPage from './pages/mentor/StudentDetailPage';
import AssessmentPage from './pages/mentor/AssessmentPage';
import AssessmentDetailPage from './pages/mentor/AssessmentDetailPage';
import StudentAssessmentPage from './pages/student/AssessmentPage';
import StudentAssessmentDetailPage from './pages/student/AssessmentDetailPage';
import StudentProfilePage from './pages/student/StudentProfile';
import StudentMentorPage from './pages/student/AssignedMentorPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          {/* ADMIN - All protected by AdminRoute */}
          <Route path="/admin" element={<AdminRoute />}>
            <Route index element={<DashboardAdminPage />} />
            <Route path="profile" element={<AdminProfile />} />
            <Route path="admins" element={<AdminPage />} />
            <Route path="admins/create" element={<AdminCreatePage />} />
            <Route path="admins/edit/:id" element={<AdminUpdatePage />} />
            <Route path="students" element={<StudentPage />} />
            <Route path="students/create" element={<StudentCreatePage />} />
            <Route path="students/detail/:id" element={<StudentDetailPage />} />
            <Route path="students/edit/:id" element={<StudentUpdatePage />} />
            <Route path="companies" element={<CompanyPage />} />
            <Route path="companies/create" element={<CompanyCreatePage />} />
            <Route path="companies/detail/:id" element={<CompanyDetailPage />} />
            <Route path="companies/edit/:id" element={<CompanyUpdatePage />} />
            <Route path="mentors" element={<MentorPageAdmin />} />
            <Route path="mentors/detail/:mentorId" element={<MentorDetailPageAdmin />} />
            <Route path="mentors/edit/:mentorId" element={<MentorUpdatePageAdmin />} />
            <Route path="programs" element={<ProgramPageAdmin />} />
            <Route path="programs/detail/:programId" element={<ProgramDetailPageAdmin />} />
            <Route path="applications" element={<ApplicationPageAdmin />} />
            <Route path="applications/detail/:applicationId" element={<ApplicationDetailPageAdmin />} />
            {/* Tambahkan route admin lain di sini */}
          </Route>
          {/* COMPANY - All protected by CompanyRoute */}
          <Route path="/company" element={<CompanyRoute />}>
            <Route index element={<DashboardCompanyPage />} />
            <Route path="profile" element={<CompanyProfile />} />
            <Route path="mentors" element={<MentorPage />} />
            <Route path="mentors/create" element={<MentorCreatePage />} />
            <Route path="mentors/edit/:mentorId" element={<MentorUpdatePage />} />
            <Route path="programs/create" element={<ProgramCreatePage />} />
            <Route path="programs/:id" element={<ProgramDetail />} />
            <Route path="programs/:id/edit" element={<ProgramUpdatePage />} />
            <Route path="applications" element={<ApplicationPage />} />
          </Route>
          {/* MENTOR - All protected by MentorRoute */}
          <Route path="/mentor" element={<MentorRoute />}>
            <Route index element={<DashboardMentorPage />} />
            <Route path="profile" element={<MentorProfile />} />
            <Route path="programs" element={<MentorProgramsPage />} />
            <Route path="students" element={<MentorStudentsPage />} />
            <Route path="students/detail/:id" element={<MentorStudentDetailPage />} />
            <Route path="assessments" element={<AssessmentPage />} />
            <Route path="assessments/detail/:id" element={<AssessmentDetailPage />} />
          </Route>
          {/* STUDENT - All protected by StudentRoute */}
          <Route path="/student" element={<StudentRoute />}>
            <Route index element={<DashboardStudentPage />} />
            <Route path="programs" element={<ProgramPage />} />
            <Route path="programs/:id" element={<ProgramDetailPage />} />
            <Route path="programs/applied" element={<AppliedProgramsPage />} />
            <Route path="assessments" element={<StudentAssessmentPage />} />
            <Route path="assessments/detail/:id" element={<StudentAssessmentDetailPage />} />
            <Route path="profile" element={<StudentProfilePage />} />
            <Route path="mentors" element={<StudentMentorPage />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
