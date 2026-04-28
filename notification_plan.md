# Phương án thực hiện: Hệ thống Thông báo (Learner Side)

Dựa trên yêu cầu hoàn thiện chức năng thông báo mà không thay đổi code ở Backend (BE), phương án thực hiện tập trung vào việc xây dựng một hệ thống quản lý thông báo phía Client (Client-Side Management) mạnh mẽ và có khả năng mở rộng.

## 1. Luồng hoạt động (Notification Flow)

Vì BE chưa có module Notification, chúng ta sẽ quản lý trạng thái thông báo hoàn toàn ở FE:

1.  **Ghi nhận sự kiện (Event Triggering)**: Các hành động quan trọng ở FE (như thanh toán thành công, hoàn thành bài học, nhận chứng chỉ) sẽ kích hoạt hàm `addNotification`.
2.  **Lưu trữ (State Management & Persistence)**: Sử dụng **Zustand** kết hợp với middleware `persist` để lưu danh sách thông báo vào `localStorage`. Điều này đảm bảo thông báo không bị mất khi người dùng reload trang hoặc tắt trình duyệt.
3.  **Hiển thị (UI/UX)**:
    - **Badge số lượng**: Hiển thị số thông báo chưa đọc trên icon chuông ở Header.
    - **Quick View (Dropdown)**: Cho phép xem nhanh 5 thông báo gần nhất và đánh dấu đã đọc khi click.
    - **Trang quản lý (Full Page)**: Một trang riêng biệt để xem toàn bộ lịch sử, đánh dấu tất cả đã đọc hoặc xóa thông báo.

## 2. Cấu trúc dữ liệu (Data Structure)

Mỗi thông báo sẽ có các trường sau:

- `id`: Chuỗi duy nhất.
- `type`: Loại thông báo (`system`, `course`, `promo`, `success`, `warning`) để hiển thị icon và màu sắc tương ứng.
- `title`: Tiêu đề ngắn gọn.
- `message`: Nội dung chi tiết.
- `time`: Thời gian hiển thị (ví dụ: "Vừa xong", "2 giờ trước").
- `unread`: Trạng thái đã đọc/chưa đọc.
- `link`: Đường dẫn điều hướng khi người dùng click vào thông báo.

## 3. Các thành phần đã triển khai

- **Notification Store (`src/store/notification.store.ts`)**: Quản lý logic thêm, sửa, xóa và lưu trữ thông báo.
- **Header Integration**: Kết nối icon chuông với store để hiển thị badge và dropdown.
- **Full Notifications Page**: Chuyển đổi từ dữ liệu mock sang dữ liệu thực từ store với đầy đủ tính năng tương tác.
- **Checkout Success Trigger**: Tự động tạo thông báo khi người dùng đăng ký khóa học thành công.

## 4. Hướng phát triển trong tương lai (khi có BE)

Khi Backend hỗ trợ module Notification, phương án chuyển đổi sẽ rất đơn giản:

1.  Thay thế `localStorage` trong store bằng các API call (`GET /notifications`, `PATCH /notifications/:id/read`).
2.  Sử dụng **WebSocket** hoặc **Server-Sent Events (SSE)** để nhận thông báo real-time từ server.
3.  Đồng bộ hóa trạng thái "đã đọc" trên nhiều thiết bị.
