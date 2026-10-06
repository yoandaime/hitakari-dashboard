import { useEffect } from "react"
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom"
import { toast } from "sonner"

import { AppShell } from "@/components/layout/AppShell"
import BudgetingPage from "@/pages/BudgetingPage"
import DetailProductModel from "@/pages/DetailProductModel"
import DetailProductRest from "@/pages/DetailProductRest"
import FAQPage from "@/pages/FAQPage"
import LandingPage from "@/pages/LandingPage"
import MySubscription from "@/pages/MySubscription"
import ProductCatalog from "@/pages/ProductCatalog"
import RoleManagement from "@/pages/RoleManagement"
import SubscriptionRequest from "@/pages/SubscriptionRequest"
import { Toaster } from "@/components/ui/sonner"
import { consumeResetFlag } from "@/lib/demo-data"

function DashboardLayout({ activePage, children }) {
  const navigate = useNavigate()

  function handleNavigate(key) {
    if (key === "budgeting") {
      navigate("/budgeting-page")
      return
    }
    if (key === "role-management") {
      navigate("/role-management")
      return
    }
    if (key === "subscription-request") {
      navigate("/subscription-request")
      return
    }
    if (key === "my-subscription") {
      navigate("/my-subscription")
      return
    }
    toast.info("This feature is under development")
  }

  return (
    <AppShell activePage={activePage} onNavigate={handleNavigate}>
      {children}
    </AppShell>
  )
}

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function App() {
  useEffect(() => {
    if (consumeResetFlag()) toast.success("Demo data has been reset.")
  }, [])

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route
          path="/budgeting-page"
          element={
            <DashboardLayout activePage="budgeting">
              <BudgetingPage />
            </DashboardLayout>
          }
        />
        <Route
          path="/subscription-request"
          element={
            <DashboardLayout activePage="subscription-request">
              <SubscriptionRequest />
            </DashboardLayout>
          }
        />
        <Route
          path="/my-subscription"
          element={
            <DashboardLayout activePage="my-subscription">
              <MySubscription />
            </DashboardLayout>
          }
        />
        <Route
          path="/role-management"
          element={
            <DashboardLayout activePage="role-management">
              <RoleManagement />
            </DashboardLayout>
          }
        />
        <Route path="/detail-product-model/:id" element={<DetailProductModel />} />
        <Route path="/detail-product-model" element={<Navigate to="/product-catalog" replace />} />
        <Route path="/detail-product-rest/:id" element={<DetailProductRest />} />
        <Route path="/detail-product-rest" element={<Navigate to="/product-catalog" replace />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/landing-page" element={<LandingPage />} />
        <Route path="/product-catalog" element={<ProductCatalog />} />
        <Route path="*" element={<Navigate to="/landing-page" replace />} />
      </Routes>
      <Toaster />
    </>
  )
}

export default App
