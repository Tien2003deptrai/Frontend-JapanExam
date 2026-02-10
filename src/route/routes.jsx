// Admin routes, chỉ cho role ADMIN
export const adminRoutes = [
    {
        path: '/admin',
        // element: <ProtectedRoute element={<AdminLayOut />} allowedRoles={['admin']} />,
        children: [
            {
                index: true,
                // element: <MainDash to="students" replace />,
            },
            {
                path: 'courses',
                // element: <Course />,
            },
        ],
    },
]
