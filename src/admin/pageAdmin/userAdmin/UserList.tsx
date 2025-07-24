import React, { useEffect, useState } from 'react';
import { Table, Input, Button, Space, Popconfirm, message, Card, Tag, Segmented } from 'antd';
import dayjs from 'dayjs';
import UserFormModal from './UserFormModal';
import { getAllUsers, deleteUser, createUser, updateUser } from '@/api/user.api';
import { IUser } from '@/types/user';

const UserAdmin: React.FC = () => {
    const [users, setUsers] = useState<IUser[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<IUser[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [search, setSearch] = useState<string>('');
    const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'staff' | 'customer'>('staff');

    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [currentUser, setCurrentUser] = useState<IUser | null>(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [search, roleFilter, users]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await getAllUsers();
            setUsers(res.users);
        } catch (err) {
            message.error('Lỗi khi tải danh sách tài khoản');
        }
        setLoading(false);
    };

    const applyFilters = () => {
        const lowerSearch = search.toLowerCase();
        const filtered = users.filter(user => {
            const matchesRole = roleFilter === 'all' || user.role === roleFilter;
            const matchesSearch =
                user.username.toLowerCase().includes(lowerSearch) ||
                user.email.toLowerCase().includes(lowerSearch);
            return matchesRole && matchesSearch;
        });
        setFilteredUsers(filtered);
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    const openAddModal = () => {
        setIsEditMode(false);
        setCurrentUser(null);
        setModalVisible(true);
    };

    const openEditModal = (user: IUser) => {
        setIsEditMode(true);
        setCurrentUser(user);
        setModalVisible(true);
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteUser(id);
            message.success('Đã xóa tài khoản');
            fetchUsers();
        } catch {
            message.error('Xóa thất bại');
        }
    };

    const handleSubmit = async (values: Partial<IUser>) => {
        try {
            if (isEditMode && currentUser?._id) {
                await updateUser(currentUser._id, values);
                message.success('Cập nhật thành công');
            } else {
                if (roleFilter === 'all') {
                    message.error('Vui lòng chọn loại tài khoản để thêm');
                    return;
                }
                await createUser({ ...values, role: roleFilter });
                message.success('Thêm tài khoản thành công');
            }

            setModalVisible(false);
            fetchUsers();
        } catch {
            message.error('Có lỗi xảy ra');
        }
    };

    const columns = [
        { title: 'Tên đăng nhập', dataIndex: 'username', width: 300 },
        { title: 'Email', dataIndex: 'email', width: 400 },
        {
            title: 'Quyền',
            dataIndex: 'role',
            width: 200,
            render: (role: string) => {
                switch (role) {
                    case 'admin': return <Tag color="red">Admin</Tag>;
                    case 'staff': return <Tag color="blue">Nhân viên</Tag>;
                    case 'customer': return <Tag color="green">Khách hàng</Tag>;
                    default: return <Tag>{role}</Tag>;
                }
            }
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            render: (val: string) => dayjs(val).format('DD/MM/YYYY HH:mm')
        },
        {
            title: 'Hành động',
            width: 150,
            render: (_: any, record: IUser) => (
                roleFilter === 'staff' && (
                    <Space>
                        <Button type="link" onClick={() => openEditModal(record)}>Sửa</Button>
                        <Popconfirm title="Xác nhận xóa?" onConfirm={() => handleDelete(record._id!)}>
                            <Button type="link" danger>Xóa</Button>
                        </Popconfirm>
                    </Space>
                )
            )
        }

    ];

    return (
        <div className="p-4">
            <Card
                title={
                    <Space>
                        <span>Quản lý Tài khoản</span>
                        <Segmented
                            value={roleFilter}
                            onChange={(val) => setRoleFilter(val as 'all' | 'admin' | 'staff' | 'customer')}
                            options={[
                                { label: 'Tất cả', value: 'all' },
                                { label: 'Quản trị', value: 'admin' },
                                { label: 'Nhân viên', value: 'staff' },
                                { label: 'Người dùng', value: 'customer' },
                            ]}
                        />
                    </Space>
                }
                extra={
                    roleFilter === 'staff' ? (
                        <Button type='primary' onClick={openAddModal}>
                            + Thêm nhân viên
                        </Button>
                    ) : null
                }

            >
                <Input.Search
                    placeholder="Tìm kiếm theo tên hoặc email"
                    onChange={handleSearch}
                    className="mb-4 max-w-md"
                    allowClear
                    value={search}
                />
                <Table
                    columns={columns}
                    dataSource={filteredUsers}
                    loading={loading}
                    rowKey="_id"
                    pagination={{ pageSize: 8 }}
                    scroll={{ x: 800 }}
                    locale={{ emptyText: 'Không có dữ liệu phù hợp' }}
                />

            </Card>

            <UserFormModal
                visible={modalVisible}
                isEditMode={isEditMode}
                currentStaff={currentUser}
                onCancel={() => setModalVisible(false)}
                onSubmit={handleSubmit}
            />
        </div>
    );
};

export default UserAdmin;
