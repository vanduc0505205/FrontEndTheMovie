import React, { useEffect, useState } from 'react';
import { Modal, Button, Card, Col, Row, Typography, message, Spin, Space } from 'antd';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPizzaSlice, faGlassCheers, faPlusCircle, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { ICombo } from '@/interface/combo';

interface ComboSelectionModalProps {
    visible: boolean;
    onClose: () => void;
    onUpdateCombos: (combos: any[]) => void;
    selectedCombos: any[];
}

const ComboSelectionModal: React.FC<ComboSelectionModalProps> = ({ visible, onClose, onUpdateCombos, selectedCombos }) => {
    const [combos, setCombos] = useState<ICombo[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCombos = async () => {
            if (visible) {
                setLoading(true);
                setError(null);
                try {
                    const response = await axios.get('http://localhost:3000/combo/available');
                    setCombos(response.data.data);
                } catch (err) {
                    console.error('Lỗi khi tải danh sách combo:', err);
                    setError('Không thể tải danh sách combo. Vui lòng thử lại sau.');
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchCombos();
    }, [visible]);

    const handleSelect = (combo: ICombo) => {
        // Tìm xem combo đã tồn tại trong danh sách được chọn chưa
        const existingCombo = selectedCombos.find(
            (selected) => selected._id === combo._id
        );

        if (existingCombo) {
            // Nếu đã tồn tại, tạo một mảng mới với số lượng được tăng lên 1
            const updatedCombos = selectedCombos.map((selected) =>
                selected._id === combo._id
                    ? { ...selected, quantity: (selected.quantity || 0) + 1 }
                    : selected
            );
            onUpdateCombos(updatedCombos);
            message.success(`Đã tăng số lượng combo ${combo.name} lên 1.`);
        } else {
            // ✅ DÒNG QUAN TRỌNG: Tạo đối tượng combo mới
            // Sử dụng spread operator (`...combo`) để sao chép tất cả các thuộc tính gốc
            const newCombo = { ...combo, quantity: 1 };
            onUpdateCombos([...selectedCombos, newCombo]);
            message.success(`Đã thêm combo ${combo.name} vào giỏ hàng.`);
        }
    };

    return (
        <Modal
            title={<h3 className="text-white text-center text-2xl font-bold">Chọn Combo Ưu Đãi</h3>}
            open={visible}
            onCancel={onClose}
            footer={null}
            width={800}
            centered
            className="custom-modal"
            bodyStyle={{ maxHeight: '70vh', overflowY: 'auto' }}
        >
            <div className="p-4">
                {loading ? (
                    <div className="flex justify-center items-center h-48">
                        <Spin size="large" tip="Đang tải combo..." />
                    </div>
                ) : error ? (
                    <div className="text-center text-red-500 py-10">{error}</div>
                ) : combos.length === 0 ? (
                    <div className="text-center text-gray-500 py-10">Hiện chưa có combo nào.</div>
                ) : (
                    <Row gutter={[16, 16]}>
                        {combos.map(combo => {
                            const isSelected = selectedCombos.some(selected => selected._id === combo._id);
                            return (
                                <Col xs={24} sm={12} md={8} key={combo._id}>
                                    <Card
                                        hoverable
                                        className={`relative overflow-hidden group border border-gray-700 bg-gray-900 text-white rounded-lg ${isSelected ? 'ring-2 ring-yellow-500' : ''}`}
                                        cover={
                                            <img
                                                alt={combo.name}
                                                src={`http://localhost:3000${combo.imageUrl}`}
                                                className="w-full h-40 object-cover transform group-hover:scale-105 transition-transform duration-300"
                                            />
                                        }
                                    >
                                        <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                                            -{Math.round((1 - (combo.price / 100000)) * 100)}%
                                        </div>
                                        <div className="p-2 text-center">
                                            <h4 className="font-bold text-lg text-amber-400 mb-1">
                                                {combo.name}
                                            </h4>
                                            <div className="text-gray-400 text-sm mb-2">
                                                {combo.popcorns?.map((p, idx) => (
                                                    <div key={`popcorn-${idx}`} className="flex items-center justify-center gap-1">
                                                        <FontAwesomeIcon icon={faPizzaSlice} className="text-yellow-500" />
                                                        {p.name}
                                                    </div>
                                                ))}
                                                {combo.drinks?.map((d, idx) => (
                                                    <div key={`drink-${idx}`} className="flex items-center justify-center gap-1">
                                                        <FontAwesomeIcon icon={faGlassCheers} className="text-blue-400" />
                                                        {d.name}
                                                    </div>
                                                ))}
                                            </div>
                                            <p className="text-white text-xl font-bold">
                                                {combo.price.toLocaleString('vi-VN')} VNĐ
                                            </p>
                                            <Button
                                                type="primary"
                                                onClick={() => handleSelect(combo)}
                                                className="mt-4 w-full bg-red-600 hover:bg-red-700 border-none"
                                                disabled={isSelected}
                                            >
                                                <Space>
                                                    {isSelected ? (
                                                        <>
                                                            <FontAwesomeIcon icon={faCheckCircle} />
                                                            Đã thêm
                                                        </>
                                                    ) : (
                                                        <>
                                                            <FontAwesomeIcon icon={faPlusCircle} />
                                                            Thêm vào giỏ hàng
                                                        </>
                                                    )}
                                                </Space>
                                            </Button>
                                        </div>
                                    </Card>
                                </Col>
                            );
                        })}
                    </Row>
                )}
            </div>
            <div className="text-center mt-6">
                <Button onClick={onClose} size="large">
                    Đóng
                </Button>
            </div>
        </Modal>
    );
};

export default ComboSelectionModal;