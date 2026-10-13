import React, { useEffect, useState } from 'react';
import { Card, Button, Space, message, Input } from 'antd';
import { PlusOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { useEmployeeStore } from '../../../stores/useEmployeeStore';
import EmployeeTable from './EmployeeTable';
import EmployeeFormModal from './EmployeeFormModal';

export const AdminEmployeesPage = () => {
  const {
    employees,
    total,
    page,
    limit,
    isLoading,
    filters,
    fetchEmployees,
    fetchEmployeeById,
    setFilters,
    setPage,
    createEmployee,
    updateEmployee,
    toggleStatus,
    refresh
  } = useEmployeeStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleEdit = async (emp) => {
    const id = emp.employeeId || emp.id;
    const hide = message.loading('Đang tải dữ liệu chi tiết...', 0);
    try {
      const detail = await fetchEmployeeById(id);
      hide();
      setEditingEmployee(detail || emp);
      setModalOpen(true);
    } catch {
      hide();
      setEditingEmployee(emp);
      setModalOpen(true);
    }
  };

  const handleAddNew = () => {
    setEditingEmployee(null);
    setModalOpen(true);
  };

  const handleModalSubmit = async (values) => {
    if (editingEmployee) {
      const id = editingEmployee.employeeId || editingEmployee.id;
      const res = await updateEmployee(id, values);
      if (res.success) {
        message.success('Cập nhật nhân viên thành công!');
        setModalOpen(false);
      } else {
        message.error(res.error || 'Cập nhật thất bại');
      }
    } else {
      const res = await createEmployee(values);
      if (res.success) {
        message.success('Tạo tài khoản nhân viên thành công!');
        setModalOpen(false);
      } else {
        message.error(res.error || 'Tạo mới thất bại');
      }
    }
  };

  const handleToggleStatus = async (id, status) => {
    const res = await toggleStatus(id, status);
    if (res.success) {
      message.success(status ? 'Đã mở khóa tài khoản' : 'Đã khóa tài khoản');
    } else {
      message.error(res.error || 'Thao tác thất bại');
    }
  };

  return (
    <Card
      title="Quản lý Tài khoản & Phân quyền Nhân Viên"
      variant="borderless"
      extra={
        <Space wrap>
          <Input
            placeholder="Tìm theo tên hoặc username..."
            prefix={<SearchOutlined />}
            value={filters.keyword}
            onChange={(e) => setFilters({ keyword: e.target.value })}
            style={{ width: 240 }}
            allowClear
          />
          <Button icon={<ReloadOutlined />} onClick={refresh}>
            Làm mới
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>
            Thêm nhân viên
          </Button>
        </Space>
      }
    >
      <EmployeeTable
        employees={employees}
        isLoading={isLoading}
        page={page}
        limit={limit}
        total={total}
        onPageChange={(p) => setPage(p)}
        onEdit={handleEdit}
        onToggleStatus={handleToggleStatus}
      />

      <EmployeeFormModal
        open={modalOpen}
        editingEmployee={editingEmployee}
        isLoading={isLoading}
        onCancel={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
      />
    </Card>
  );
};

export default AdminEmployeesPage;
