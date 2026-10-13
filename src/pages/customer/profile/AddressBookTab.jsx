import React, { useState } from 'react';
import { Card, List, Button, Tag, Space, Popconfirm, Modal, Form, Input, message } from 'antd';
import { PlusOutlined, DeleteOutlined, StarOutlined, HomeOutlined } from '@ant-design/icons';
import { useAddressStore } from '../../../stores/useAddressStore';

export const AddressBookTab = () => {
  const { addresses, isLoading, createAddress, setDefaultAddress, deleteAddress } = useAddressStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const handleCreate = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);
      const res = await createAddress(values);
      if (res.success) {
        message.success('Thêm địa chỉ giao hàng thành công!');
        form.resetFields();
        setModalOpen(false);
      } else {
        message.error(res.error || 'Thêm địa chỉ thất bại');
      }
    } catch (err) {
      // Validate failed
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card
      title="Sổ địa chỉ nhận hàng"
      variant="borderless"
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>
          Thêm địa chỉ mới
        </Button>
      }
    >
      <List
        loading={isLoading}
        dataSource={addresses}
        renderItem={(item) => {
          const id = item.addressId || item.id;
          return (
            <List.Item
              actions={[
                !item.isDefault && (
                  <Button
                    key="set-default"
                    size="small"
                    icon={<StarOutlined />}
                    onClick={() => setDefaultAddress(id)}
                  >
                    Đặt mặc định
                  </Button>
                ),
                <Popconfirm
                  key="delete-addr"
                  title="Xóa địa chỉ này?"
                  onConfirm={() => deleteAddress(id)}
                >
                  <Button size="small" danger icon={<DeleteOutlined />} />
                </Popconfirm>
              ].filter(Boolean)}
            >
              <List.Item.Meta
                avatar={<HomeOutlined style={{ fontSize: 22, color: '#008848' }} />}
                title={
                  <Space>
                    <strong>{item.receiverName}</strong>
                    <span>({item.phoneNumber})</span>
                    {item.isDefault && <Tag color="green">Mặc định</Tag>}
                  </Space>
                }
                description={`${item.street}, ${item.ward}, ${item.city}`}
              />
            </List.Item>
          );
        }}
      />

      <Modal
        title="Thêm địa chỉ nhận hàng mới"
        open={modalOpen}
        onOk={handleCreate}
        onCancel={() => setModalOpen(false)}
        confirmLoading={submitting}
        okText="Lưu địa chỉ"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="receiverName" label="Họ tên người nhận" rules={[{ required: true }]}>
            <Input placeholder="Nguyễn Văn A" />
          </Form.Item>
          <Form.Item name="phoneNumber" label="Số điện thoại" rules={[{ required: true }]}>
            <Input placeholder="0901234567" />
          </Form.Item>
          <Form.Item name="street" label="Địa chỉ cụ thể (Số nhà, tên đường)" rules={[{ required: true }]}>
            <Input placeholder="123 Nguyễn Thị Thập" />
          </Form.Item>
          <Form.Item name="ward" label="Phường / Xã" rules={[{ required: true }]}>
            <Input placeholder="Phường Tân Phong" />
          </Form.Item>
          <Form.Item name="city" label="Quận / Huyện / Tỉnh / TP" rules={[{ required: true }]}>
            <Input placeholder="Quận 7, TP. Hồ Chí Minh" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default AddressBookTab;
