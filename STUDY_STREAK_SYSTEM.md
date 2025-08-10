# Study Streak System

ระบบ Study Streak สำหรับแอปพลิเคชันการเรียนรู้ที่ช่วยให้ผู้ใช้ติดตามและรักษา streak การเรียนต่อเนื่อง

## ฟีเจอร์หลัก

### 1. Study Session Tracking
- บันทึกการเริ่มต้นและสิ้นสุด session การเรียน
- คำนวณระยะเวลาการเรียน (นาที/ชั่วโมง)
- ตรวจสอบ session ที่ถูกต้อง (ไม่น้อยกว่า 5 นาที, ไม่เกิน 8 ชั่วโมงต่อวัน)

### 2. Streak Calculation
- คำนวณ consecutive days ของการเรียน
- รีเซ็ต streak เมื่อไม่ได้เรียนติดต่อกัน 1 วัน
- แสดง streak ปัจจุบันและ streak สูงสุด

### 3. Daily Goals & Achievements
- ตั้งเป้าหมายการเรียนรายวัน (นาที/ชั่วโมง)
- แสดงสถานะการบรรลุเป้าหมาย
- ระบบ achievements และ badges

### 4. Statistics & Analytics
- สถิติการเรียนรายวัน/สัปดาห์/เดือน
- กราฟแสดงแนวโน้มการเรียน
- รายงานสรุป performance

## โครงสร้าง Database

### Study Sessions Table
```sql
CREATE TABLE study_sessions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP,
    duration_minutes INTEGER,
    subject VARCHAR(100),
    session_type VARCHAR(50),
    is_completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### User Streaks Table
```sql
CREATE TABLE user_streaks (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_study_date DATE,
    total_study_days INTEGER DEFAULT 0,
    total_study_minutes INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Daily Goals Table
```sql
CREATE TABLE daily_goals (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    target_minutes INTEGER NOT NULL,
    goal_date DATE NOT NULL,
    achieved_minutes INTEGER DEFAULT 0,
    is_achieved BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Achievements Table
```sql
CREATE TABLE achievements (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    achievement_type VARCHAR(50) NOT NULL,
    achievement_name VARCHAR(100) NOT NULL,
    description TEXT,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);
```

### Study Statistics Table
```sql
CREATE TABLE study_statistics (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    date DATE NOT NULL,
    total_minutes INTEGER DEFAULT 0,
    sessions_count INTEGER DEFAULT 0,
    subjects_studied TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, date)
);
```

## API Endpoints

### Study Session Management
- `POST /api/v1/study-sessions/start` - เริ่มต้น session การเรียน
- `POST /api/v1/study-sessions/end` - สิ้นสุด session การเรียน
- `GET /api/v1/study-sessions/current` - ดู session ปัจจุบัน
- `GET /api/v1/study-sessions/history` - ดูประวัติ session
- `PUT /api/v1/study-sessions/{id}` - แก้ไข session
- `DELETE /api/v1/study-sessions/{id}` - ลบ session

### Streak Management
- `GET /api/v1/streaks/current` - ดู streak ปัจจุบัน
- `GET /api/v1/streaks/statistics` - ดูสถิติ streak
- `GET /api/v1/streaks/leaderboard` - ดู leaderboard

### Daily Goals
- `POST /api/v1/goals/daily` - สร้างเป้าหมายรายวัน
- `GET /api/v1/goals/daily/current` - ดูเป้าหมายปัจจุบัน
- `PUT /api/v1/goals/daily/{id}` - แก้ไขเป้าหมาย
- `GET /api/v1/goals/daily/history` - ดูประวัติเป้าหมาย

### Analytics & Reports
- `GET /api/v1/analytics/daily` - สถิติรายวัน
- `GET /api/v1/analytics/weekly` - สถิติรายสัปดาห์
- `GET /api/v1/analytics/monthly` - สถิติรายเดือน
- `GET /api/v1/analytics/trends` - แนวโน้มการเรียน

### Achievements
- `GET /api/v1/achievements/user` - ดู achievements ของผู้ใช้
- `GET /api/v1/achievements/available` - ดู achievements ที่สามารถได้รับ
- `POST /api/v1/achievements/unlock` - ปลดล็อก achievement

## Business Logic

### Streak Calculation Rules
- ต้องมีการเรียนอย่างน้อย 5 นาทีต่อวันเพื่อนับเป็น streak
- ถ้าไม่ได้เรียนติดต่อกัน 1 วัน จะรีเซ็ต streak เป็น 0
- เก็บสถิติ longest streak แยกต่างหาก

### Session Validation
- Session ต้องมีระยะเวลาอย่างน้อย 5 นาที
- ไม่เกิน 8 ชั่วโมงต่อวัน
- ไม่สามารถมี active session มากกว่า 1 session ต่อ user

### Timezone Handling
- ใช้ UTC สำหรับการเก็บข้อมูล
- แสดงผลตาม timezone ของ user

### Achievement System
- **First Day**: เรียนวันแรก
- **Week Warrior**: เรียนติดต่อกัน 7 วัน
- **Month Master**: เรียนติดต่อกัน 30 วัน
- **Century Club**: เรียนรวม 100 ชั่วโมง
- **Goal Crusher**: บรรลุเป้าหมายรายวัน 10 วันติดต่อกัน

## การใช้งาน

### 1. เริ่มต้น Session การเรียน
```bash
POST /api/v1/study-sessions/start
Content-Type: application/json
Authorization: Bearer <jwt_token>

{
    "subject": "Mathematics",
    "sessionType": "Study"
}
```

**Response:**
```json
{
    "id": 1,
    "userId": 123,
    "startTime": "2024-01-15T10:00:00Z",
    "subject": "Mathematics",
    "sessionType": "Study",
    "isCompleted": false
}
```

### 2. สิ้นสุด Session การเรียน
```bash
POST /api/v1/study-sessions/end?sessionId=1
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
    "id": 1,
    "userId": 123,
    "startTime": "2024-01-15T10:00:00Z",
    "endTime": "2024-01-15T11:30:00Z",
    "durationMinutes": 90,
    "subject": "Mathematics",
    "sessionType": "Study",
    "isCompleted": true
}
```

### 3. ดู Streak ปัจจุบัน
```bash
GET /api/v1/streaks/current
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
    "currentStreak": 5,
    "longestStreak": 12,
    "lastStudyDate": "2024-01-15",
    "totalStudyDays": 25,
    "totalStudyMinutes": 1800,
    "todayMinutes": 90
}
```

### 4. สร้างเป้าหมายรายวัน
```bash
POST /api/v1/goals/daily
Content-Type: application/json
Authorization: Bearer <jwt_token>

{
    "targetMinutes": 120
}
```

**Response:**
```json
{
    "id": 1,
    "userId": 123,
    "targetMinutes": 120,
    "goalDate": "2024-01-15",
    "achievedMinutes": 0,
    "isAchieved": false
}
```

### 5. ดูสถิติรายวัน
```bash
GET /api/v1/analytics/daily?date=2024-01-15
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
    "date": "2024-01-15",
    "totalMinutes": 90,
    "sessionsCount": 1,
    "subjectsStudied": ["Mathematics"],
    "goalProgress": {
        "targetMinutes": 120,
        "achievedMinutes": 90,
        "percentage": 75,
        "isAchieved": false
    }
}
```

## Error Handling

### Common Error Codes
- `400 Bad Request`: ข้อมูลไม่ถูกต้อง
- `401 Unauthorized`: ไม่มีสิทธิ์เข้าถึง
- `403 Forbidden`: ไม่อนุญาตให้ดำเนินการ
- `404 Not Found`: ไม่พบข้อมูล
- `409 Conflict`: ข้อมูลขัดแย้ง (เช่น มี active session อยู่แล้ว)
- `422 Unprocessable Entity`: ข้อมูลไม่ผ่านการตรวจสอบ

### Error Response Format
```json
{
    "timestamp": "2024-01-15T10:00:00Z",
    "status": 400,
    "error": "Bad Request",
    "message": "Session duration must be at least 5 minutes",
    "path": "/api/v1/study-sessions/end"
}
```

## การทดสอบ

### Unit Tests
```bash
# รัน unit tests ทั้งหมด
mvn test

# รันเฉพาะ test class
mvn test -Dtest=StudySessionServiceTest

# รันเฉพาะ test method
mvn test -Dtest=StudySessionServiceTest#testStartSession
```

### Integration Tests
```bash
# รัน integration tests
mvn test -Dtest=StudySessionControllerIntegrationTest
```

### API Tests
```bash
# ใช้ Postman หรือ curl สำหรับทดสอบ API
curl -X POST http://localhost:8080/api/v1/study-sessions/start \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"subject": "Mathematics", "sessionType": "Study"}'
```

## การ Deploy

### 1. Environment Setup
```bash
# สร้าง database
createdb study_streak_db

# รัน migrations
mvn flyway:migrate

# ตั้งค่า environment variables
export SPRING_PROFILES_ACTIVE=production
export DATABASE_URL=jdbc:postgresql://localhost:5432/study_streak_db
export JWT_SECRET=your-secret-key
```

### 2. Build Application
```bash
# Build JAR file
mvn clean package -DskipTests

# Run application
java -jar target/study-streak-system-1.0.0.jar
```

### 3. Docker Deployment
```dockerfile
FROM openjdk:17-jdk-slim
COPY target/study-streak-system-1.0.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

```bash
# Build Docker image
docker build -t study-streak-system .

# Run container
docker run -p 8080:8080 study-streak-system
```

### 4. Health Check
```bash
# ตรวจสอบ application health
curl http://localhost:8080/actuator/health

# ตรวจสอบ API documentation
curl http://localhost:8080/swagger-ui/index.html
```

## การ Monitor และ Logging

### Application Metrics
- Response time ของ API endpoints
- Error rate และ error types
- Database connection pool usage
- JVM memory และ CPU usage

### Logging Configuration
```yaml
logging:
  level:
    com.studystreak: DEBUG
    org.springframework.web: INFO
  pattern:
    console: "%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n"
    file: "%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n"
  file:
    name: logs/study-streak-system.log
```

## การพัฒนาเพิ่มเติม

### Features ที่อาจเพิ่มในอนาคต
- **Notifications System**: แจ้งเตือนเมื่อ streak ใกล้จะขาด
- **Social Features**: แชร์ streak, leaderboard, challenges
- **Advanced Analytics**: Machine learning สำหรับแนะนำการเรียน
- **Study Groups**: ระบบกลุ่มเรียนร่วมกัน
- **Gamification**: Points, levels, rewards
- **Integration**: เชื่อมต่อกับ calendar, reminder apps

### Performance Optimizations
- **Database Indexing**: สร้าง indexes สำหรับ queries ที่ใช้บ่อย
- **Caching**: Redis cache สำหรับข้อมูลที่เรียกใช้บ่อย
- **Pagination**: สำหรับ large datasets
- **Background Jobs**: สำหรับการคำนวณ streak และ statistics
- **CDN**: สำหรับ static resources

### Security Enhancements
- **Rate Limiting**: จำกัดจำนวน requests ต่อ user
- **Input Validation**: ตรวจสอบข้อมูล input อย่างเข้มงวด
- **Audit Logging**: บันทึกการเปลี่ยนแปลงข้อมูลสำคัญ
- **Data Encryption**: เข้ารหัสข้อมูลที่สำคัญ

## การสนับสนุน

### Documentation
- API Documentation: `/swagger-ui/index.html`
- Database Schema: `docs/database-schema.sql`
- Deployment Guide: `docs/deployment.md`

### Contact
- **Development Team**: dev-team@company.com
- **Technical Support**: support@company.com
- **Bug Reports**: bugs@company.com

### Version History
- **v1.0.0**: Initial release with basic streak functionality
- **v1.1.0**: Added achievements system
- **v1.2.0**: Enhanced analytics and reporting
- **v1.3.0**: Social features and leaderboard

---

**Note**: เอกสารนี้จะได้รับการอัปเดตเมื่อมีการเพิ่มฟีเจอร์ใหม่หรือเปลี่ยนแปลงระบบ 