import NavbarAdminDashboard from '../../components/NavbarAdminDashboard';

// Update the return JSX
return (
  <div className="flex min-h-screen bg-sky-50">
    <AdminSidebar />
    <div className="flex-1 ml-[260px]">
      <NavbarAdminDashboard />
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <Button
            type="default"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/dashboard')}
            className="flex items-center"
          >
            Back to Dashboard
          </Button>

          {/* Rest of the existing header content */}
        </div>

        {/* Rest of the existing content */}
        <Card className="shadow-md">
          {/* ... existing card content ... */}
        </Card>
      </div>
    </div>
  </div>
); 