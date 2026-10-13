import React from 'react';
import { Space, Input, Select, Button } from 'antd';
import { UserOutlined, PhoneOutlined, ReloadOutlined } from '@ant-design/icons';
import { POSITION_LABELS } from '../../../constants/enums';

export const EmployeeFilterBar = ({
  nameKeyword,
  phoneKeyword,
  position,
  status,
  onNameChange,
  onPhoneChange,
  onPositionChange,
  onStatusChange,
  onReset,
  onRefresh
}) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
      <Space wrap>
        <Input
          placeholder="Tìm theo họ tên..."
          prefix={<UserOutlined />}
          value={nameKeyword}
          onChange={(e) => onNameChange(e.target.value)}
          style={{ width: 200 }}
          allowClear
        />

        <Input
          placeholder="Tìm theo SĐT..."
          prefix={<PhoneOutlined />}
          value={phoneKeyword}
          onChange={(e) => onPhoneChange(e.target.value)}
          style={{ width: 170 }}
          allowClear
        />

        <Select
          placeholder="Tất cả chức vụ"
          value={position || undefined}
          onChange={onPositionChange}
          style={{ width: 170 }}
          allowClear
        >
          <Select.Option value="ADMIN">Quản trị viên (ADMIN)</Select.Option>
          <Select.Option value="STAFF">Nhân viên (STAFF)</Select.Option>
        </Select>

        <Select
          placeholder="Tất cả trạng thái"
          value={status === '' ? undefined : status}
          onChange={onStatusChange}
          style={{ width: 170 }}
          allowClear
        >
          <Select.Option value={true}>Đang hoạt động</Select.Option>
          <Select.Option value={false}>Đã khóa</Select.Option>
        </Select>

        <Button onClick={onReset}>Xóa lọc</Button>
      </Space>

      <Button icon={<ReloadOutlined />} onClick={onRefresh}>
        Làm mới
      </Button>
    </div>
  );
};

export default EmployeeFilterBar;
