import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Button, InputNumber, Row, Col, Switch, message, notification, Upload, Typography, Space } from 'antd';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { ICombo, IItem } from '@/interface/combo';
import { comboApi } from "@/api/combo.api";
import type { UploadFile } from 'antd/es/upload/interface';

const { useForm, Item: FormItem, List: FormList } = Form;
const { Text } = Typography;

interface ComboModalProps {
    visible: boolean;
    onClose: () => void;
    comboData?: ICombo;
    onSuccess: () => void;
}

const ComboModal: React.FC<ComboModalProps> = ({ visible, onClose, comboData, onSuccess }) => {
    const [form] = useForm();
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (comboData) {
            form.setFieldsValue(comboData);
            if (comboData.imageUrl) {
                const backendUrl = "http://localhost:3000"; 
                setFileList([{
                    uid: '-1',
                    name: comboData.imageUrl.substring(comboData.imageUrl.lastIndexOf('/') + 1),
                    status: 'done',
                    url: `${backendUrl}${comboData.imageUrl}`, 
                }]);
            } else {
                setFileList([]);
            }
        } else {
            form.resetFields();
            setFileList([]);
        }
    }, [comboData, form, visible]);

    const onFinish = async (values: any) => {
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            
            formData.append('name', values.name);
            formData.append('price', values.price);
            formData.append('description', values.description || '');
            formData.append('isAvailable', values.isAvailable);
            formData.append('popcorns', JSON.stringify(values.popcorns || []));
            formData.append('drinks', JSON.stringify(values.drinks || []));

            if (fileList.length > 0 && fileList[0].originFileObj) {
                formData.append('imageUrl', fileList[0].originFileObj);
            } else if (comboData && comboData.imageUrl && fileList.length === 0) {
                formData.append('imageUrl', 'delete');
            } else if (comboData && comboData.imageUrl) {
                 formData.append('imageUrl', comboData.imageUrl);
            }


            if (comboData) {
                await comboApi.updateCombo(comboData._id, formData);
                message.success('Cập nhật combo thành công!');
            } else {
                await comboApi.createCombo(formData);
                message.success('Tạo combo mới thành công!');
            }
            
            onSuccess();
            onClose();
        } catch (error: any) {
            let errorMessage = 'Đã có lỗi xảy ra. Vui lòng thử lại.';
            if (error.response && error.response.data && error.response.data.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }

            notification.error({
                message: 'Thất bại!',
                description: errorMessage,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFileChange = ({ fileList: newFileList }: { fileList: UploadFile[] }) => {
        setFileList(newFileList);
    };

    const isEditing = !!comboData;

    return (
        <Modal
            title={isEditing ? 'Sửa Combo' : 'Tạo Combo Mới'}
            visible={visible}
            onCancel={onClose}
            footer={null}
            destroyOnClose={true}
            width={800}
            centered
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{ popcorns: [{ name: '', quantity: 1 }], drinks: [{ name: '', quantity: 1 }], isAvailable: true }}
            >
                <Row gutter={16}>
                    <Col span={12}>
                        <FormItem name="name" label="Tên Combo" rules={[{ required: true, message: 'Vui lòng nhập tên combo!' }]}>
                            <Input placeholder="Nhập tên combo" />
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem name="price" label="Giá" rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}>
                            <InputNumber min={0} step={1000} style={{ width: '100%' }} placeholder="Nhập giá combo" />
                        </FormItem>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={24}>
                        <FormItem name="description" label="Mô tả">
                            <Input.TextArea placeholder="Nhập mô tả combo" rows={3} />
                        </FormItem>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <FormItem label="Hình ảnh">
                            <Upload
                                listType="picture-card"
                                fileList={fileList}
                                onChange={handleFileChange}
                                beforeUpload={() => false}
                                maxCount={1}
                                accept=".png,.jpg,.jpeg"
                            >
                                {fileList.length < 1 && (
                                    <div>
                                        <UploadOutlined />
                                        <div style={{ marginTop: 8 }}>Tải lên</div>
                                    </div>
                                )}
                            </Upload>
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem name="isAvailable" label="Trạng thái khả dụng" valuePropName="checked">
                            <Switch />
                        </FormItem>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Text strong>Bắp Rang Bơ</Text>
                        <FormList name="popcorns">
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map(({ key, name, ...restField }) => (
                                        <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                            <FormItem {...restField} name={[name, 'name']} rules={[{ required: true, message: 'Tên bỏng?' }]}>
                                                <Input placeholder="Tên bỏng" />
                                            </FormItem>
                                            <FormItem {...restField} name={[name, 'quantity']} rules={[{ required: true, message: 'SL?' }]}>
                                                <InputNumber min={1} placeholder="SL" />
                                            </FormItem>
                                            <Button type="link" onClick={() => remove(name)}>Xóa</Button>
                                        </Space>
                                    ))}
                                    <FormItem>
                                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                            Thêm Bắp Rang Bơ
                                        </Button>
                                    </FormItem>
                                </>
                            )}
                        </FormList>
                    </Col>

                    <Col span={12}>
                        <Text strong>Nước Uống</Text>
                        <FormList name="drinks">
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map(({ key, name, ...restField }) => (
                                        <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                            <FormItem {...restField} name={[name, 'name']} rules={[{ required: true, message: 'Tên nước?' }]}>
                                                <Input placeholder="Tên nước" />
                                            </FormItem>
                                            <FormItem {...restField} name={[name, 'quantity']} rules={[{ required: true, message: 'SL?' }]}>
                                                <InputNumber min={1} placeholder="SL" />
                                            </FormItem>
                                            <Button type="link" onClick={() => remove(name)}>Xóa</Button>
                                        </Space>
                                    ))}
                                    <FormItem>
                                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                            Thêm Nước Uống
                                        </Button>
                                    </FormItem>
                                </>
                            )}
                        </FormList>
                    </Col>
                </Row>

                <Row>
                    <Col span={24}>
                        <FormItem>
                            <Button type="primary" htmlType="submit" style={{ width: '100%' }} loading={isSubmitting}>
                                {isEditing ? 'Cập nhật' : 'Tạo mới'}
                            </Button>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default ComboModal;