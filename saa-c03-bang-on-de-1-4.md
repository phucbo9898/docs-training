# SAA-C03 – Bảng ôn tổng hợp (Đề 1–4)

Bảng này gộp keyword và bẫy của Đề 1–4, bỏ trùng và xếp theo 4 domain của đề thi. Ôn theo thứ tự điểm yếu ở Đề 4 (exam mode, 50%): **High-Performing 41% → Resilient 47% → Secure 61% → Cost 63%**.

## Cách dùng

1. Đọc phần **Bẫy lặp lại** trước mỗi lần làm đề. Đây là nguyên nhân của phần lớn câu sai.
2. Với mỗi bảng keyword: che cột bên phải, đọc cột trái rồi tự nói ra dịch vụ. Câu nào nói sai thì đánh dấu để ôn lại.
3. Phần **Con số cần thuộc** đọc lại vào sáng ngày thi.

## Bẫy lặp lại

Gộp từ cả 4 đề, sắp theo mức độ hay dính. Trước khi chốt đáp án, tự hỏi lại 8 câu này.

1. **Đọc sót chữ quyết định.** Gạch chân NOT, EXCEPT, LEAST, MOST cost-effective, LEAST operational overhead. "any", "only if", "always" trong đáp án thường sai.
2. **Dịch vụ nghe liên quan nhưng lạc đề, hoặc tính năng không tồn tại.** Ví dụ: S3 Cache, SQS priority, Parameter Store auto-rotate, Aurora Parallel Query, AWS Batch, Lex, SageMaker Clarify, Spot volume, SR-IOV volume, cài phần mềm lên S3, SCP gắn vào bucket. Tự hỏi: dịch vụ này có giải quyết đúng vấn đề đề nêu không?
3. **Một vế trong đáp án sai là cả đáp án sai.** Đáp án 2–3 vế phải kiểm từng vế: region, giao thức, đường đi, con số (DeleteMarkerCreated thay vì Delete, presigned URL thay vì OAC, cert ở us-east-1 cho Regional API, 800 IOPS cho volume io1 nhỏ).
4. **Có dịch vụ managed/native thì không tự build.** "LEAST overhead", "easily" → managed (Route 53 failover, DLM, Glue, Athena, Config managed rule, Predictive Scaling), không Lambda/EC2 tự viết, không snapshot rồi restore.
5. **Chọn giải pháp đắt khi đề không yêu cầu.** Multi-region, Dedicated IP, Firewall Manager cho 1 account đều là quá tay. Đề chỉ nói AZ sập thì Multi-AZ là đủ.
6. **Sai phạm vi (scope).** ELB và ASG chỉ trong 1 region; subnet và EBS nằm trong 1 AZ; VPC peering không transitive; quota EC2 tính theo region, không theo AZ.
7. **Nhầm phát hiện với ngăn chặn.** "unable to / prevent" → SCP, IAM policy. "detect / identify" → Config rule, GuardDuty.
8. **Nhầm chiều của quyền hoặc traffic.** Lambda gọi ra → execution role; ai gọi vào Lambda → resource policy. NACL stateless → phải mở outbound ephemeral port cho response. Role không có thành viên, nhiều user cùng quyền → IAM Group.

Thêm 3 tình huống hay gặp: workload "can be interrupted" → **Spot**; mạng công ty chậm, chuyển mất hàng tuần → **offline transfer**, mọi giải pháp online đều sai; tính năng chỉ bật lúc tạo (hibernation, mã hóa EBS/RDS) → phải tạo mới hoặc migrate.

**Hai lỗi vẫn lặp lại ở Đề 4 dù đã ôn:**

- **Multi-AZ không phải để scale đọc** (sai 4 câu). "read-heavy, reporting, offload read" → Read Replica hoặc cache. Multi-AZ chỉ để failover, standby không đọc được.
- **Bài toán số instance theo AZ** (sai 3 câu). Luôn xét trường hợp xấu nhất: **tổng − AZ lớn nhất ≥ N**.

## Cặp dịch vụ dễ nhầm

| Cặp | Phân biệt nhanh |
| --- | --- |
| Multi-AZ vs Read Replica | Multi-AZ: HA, failover tự động, đồng bộ, standby không đọc được. Read Replica: scale đọc, bất đồng bộ, promote thủ công |
| SQS Standard vs FIFO vs Kinesis | Standard: có thể trùng, không đảm bảo thứ tự. FIFO: exactly-once, đúng thứ tự. Kinesis: đúng thứ tự theo shard, lưu và replay được |
| Config vs CloudTrail vs EventBridge | Config: đánh giá compliance cấu hình. CloudTrail: ai gọi API gì. EventBridge: nhận event, không tự đánh giá |
| SCP vs Config | SCP: chặn trước. Config: phát hiện sau |
| GuardDuty vs Inspector vs Macie | GuardDuty: mối đe dọa từ log. Inspector: lỗ hổng phần mềm EC2/ECR/Lambda. Macie: PII trong S3 |
| Secrets Manager vs Parameter Store | Secrets Manager: có auto rotation, tính phí theo secret. Parameter Store: rẻ, không tự xoay vòng |
| IAM Identity Center vs Cognito vs Control Tower | Identity Center: nhân viên nội bộ, SSO. Cognito: người dùng cuối của app. Control Tower: dựng và quản trị multi-account |
| CloudFront vs Global Accelerator | CloudFront: HTTP, có cache. Global Accelerator: TCP/UDP, static IP, không cache |
| Lambda@Edge vs CloudFront Functions | CloudFront Functions: logic rất nhẹ (header, URL), rẻ. Lambda@Edge: logic phức tạp hơn |
| Transit Gateway vs Peering vs PrivateLink | TGW: hub nhiều VPC + VPN + DX, transitive. Peering: 1-1, không bắc cầu. PrivateLink: chỉ mở 1 dịch vụ |
| DataSync vs Storage Gateway | DataSync: di chuyển, đồng bộ dữ liệu. Storage Gateway: on-prem dùng cloud storage lâu dài |
| ENI vs ENA vs EFA | ENI: card mạng ảo cơ bản. ENA: Enhanced Networking (SR-IOV). EFA: HPC, OS-bypass |
| SSE-S3 vs SSE-KMS vs SSE-C | SSE-S3: header `AES256`, AWS tự xoay key. SSE-KMS: header `aws:kms`, có audit CloudTrail. SSE-C: bạn tự giữ key |
| ACM public vs Private CA vs self-signed vs import | Public: miễn phí, được tin cậy, tự gia hạn. Private CA: nội bộ. Self-signed: không được tin cậy. Import: không tự gia hạn |
| CloudWatch metric chuẩn vs agent / Enhanced Monitoring | Metric chuẩn từ hypervisor (CPU, network). Memory, process cần agent hoặc Enhanced Monitoring |
| Predictive vs Scheduled vs Dynamic scaling | Predictive: ML dự báo, launch trước. Scheduled: giờ cố định. Dynamic: phản ứng sau khi tải tăng |
| Budgets vs Cost Explorer vs Compute Optimizer | Budgets: cảnh báo. Cost Explorer: xem, phân tích, dự báo. Compute Optimizer: rightsizing |
| RDS snapshot + terminate vs stop | Stop vẫn tính phí storage, tự start sau 7 ngày. Snapshot + terminate rẻ nhất cho DB dùng không thường xuyên |
| Instance metadata vs user-data | Metadata: thông tin instance (IP, ID, AZ). User-data: script bootstrap |
| MGN vs Discovery Service vs VM Import | MGN: rehost, replicate liên tục. Discovery: chỉ khảo sát. VM Import: import một lần |

## Resilient (47% – ưu tiên 2)

Domain này hỏi: hệ thống có sống sót khi một phần hỏng không, và có tách rời được các thành phần không.

**4 chiến lược DR** (đề hay hỏi theo RPO/RTO và chi phí):

| Chiến lược | Ở region DR có gì | RTO | Chi phí |
| --- | --- | --- | --- |
| Backup & Restore | Chỉ có backup/snapshot | Hàng giờ | Rẻ nhất |
| Pilot Light | DB replicate sẵn, server tắt | Hàng chục phút | Thấp |
| Warm Standby | Bản thu nhỏ chạy sẵn, scale khi cần | Vài phút | Trung bình |
| Multi-site Active-Active | Bản đầy đủ chạy song song | Gần 0 | Đắt nhất |

| Thấy trong đề | Chọn |
| --- | --- |
| Scale web app, thêm elasticity | ELB + Auto Scaling Group trải nhiều AZ (hoặc Route 53 Weighted cho nhiều EC2) |
| Cần tối thiểu N instance khi 1 AZ sập | Tổng − AZ lớn nhất ≥ N; rẻ nhất mỗi AZ = N / (số AZ − 1). Ví dụ 6 instance, 3 AZ → 3-3-3 |
| RDS phải sống khi AZ sập, failover tự động | RDS Multi-AZ (sync, failover 60–120 giây, đổi CNAME) |
| Aurora failover nhanh, không đổi endpoint | Thêm Aurora Replica (reader) cùng cluster; app ghi qua Cluster endpoint |
| DR cross-region, RPO ~1 giây, RTO < 1 phút | Aurora Global Database |
| NoSQL toàn cầu, low latency, nhiều region | DynamoDB Global Tables |
| NAT Gateway không là single point of failure | 1 NAT Gateway mỗi AZ, private subnet trỏ NAT cùng AZ |
| Trang dự phòng khi app sập | Route 53 Failover routing → S3 static website |
| Chỉ sang region phụ khi region chính lỗi | Route 53 Failover routing + health check |
| Tất cả site cùng chạy | Route 53 Active-Active + health check |
| Region sập, downtime thấp nhất | Resource chạy sẵn ở region 2 + Route 53 failover (restore snapshot mất hàng giờ) |
| CloudFront lỗi 5xx, tự chuyển origin | CloudFront origin group (origin failover) |
| Backup Direct Connect | DX thứ 2, hoặc Site-to-Site VPN |
| Request bị mất khi tải đột biến | Đệm bằng SQS, ASG scale theo backlog |
| Decouple, xử lý bất đồng bộ | SQS (pull) |
| Exactly-once, đúng thứ tự | SQS FIFO |
| Message lỗi lặp lại làm nghẽn queue | Dead-letter queue + maxReceiveCount |
| 1 event gửi tới nhiều nơi (fan-out) | SNS topic → nhiều SQS; hoặc EventBridge |
| Lọc message vào từng queue | SNS subscription filter policy |
| Ưu tiên premium/free | 2 SQS queue, poll queue ưu tiên trước (SQS không có priority) |
| Bắt thay đổi item DynamoDB | DynamoDB Streams + Lambda |
| Bắt thay đổi dữ liệu Aurora MySQL | Aurora native function gọi Lambda (RDS event subscription chỉ báo sự kiện instance) |
| Chạy ECS task khi có file mới trên S3 | EventBridge rule → ECS task (không cần Lambda) |
| Workflow nhiều bước, retry, chờ duyệt | Step Functions |
| Migrate ActiveMQ/RabbitMQ | Amazon MQ |
| Chờ app cài xong mới tạo resource tiếp (CloudFormation) | CreationPolicy + cfn-signal (DependsOn chỉ ép thứ tự) |
| Đổi AMI cho ASG | Launch template version mới + Instance Refresh |
| ASG scale-in terminate instance nào | AZ nhiều instance nhất → launch template cũ nhất → gần giờ billing |
| Session bị mất khi instance bị terminate | Lưu session ra ElastiCache hoặc DynamoDB (sticky sessions vẫn mất khi instance chết) |
| Backup tập trung nhiều service, > 35 ngày, cross-account | AWS Backup (DLM chỉ cho EBS) |
| Chống xóa nhầm object S3 | Versioning + MFA Delete |
| S3 sống sót khi region sập | Cross-Region Replication (cần Versioning) |
| Redshift DR khi region sập | Cross-Region Snapshot Copy |

## High-Performing (41% – ưu tiên 1, nhiều câu nhất)

Domain này hỏi: chọn đúng loại storage, database, mạng và compute cho tải trọng.

**Storage**

| Thấy trong đề | Chọn |
| --- | --- |
| Linux, NFS, POSIX, nhiều EC2 / nhiều AZ cùng mount | EFS |
| Windows, SMB, Active Directory | FSx for Windows File Server |
| HPC, ML, tốc độ rất cao, liên kết S3 | FSx for Lustre (hot) + S3 (cold) |
| NetApp, đa giao thức NFS + SMB + iSCSI, Windows block Multi-AZ | FSx for NetApp ONTAP |
| Hybrid NFS/SMB, cache on-prem, file thành object S3 | S3 File Gateway |
| Hybrid iSCSI block | Volume Gateway |
| Thay tape backup | Tape Gateway |
| Chuyển dữ liệu 1 lần (online) | DataSync (Storage Gateway là hybrid lâu dài) |
| SFTP/FTP managed vào S3/EFS | Transfer Family |
| File > 5 GB | Multipart Upload |
| User toàn cầu upload về 1 bucket xa | S3 Transfer Acceleration (+ Multipart) |
| Biến đổi dữ liệu khi GET | S3 Object Lambda |
| Đổi size/type EBS không downtime | Elastic Volumes |
| I/O intensive, DB lớn, IOPS rất cao | EBS io2 Block Express (hoặc io1); gp3 tối đa 16.000 IOPS |
| Boot volume, dev/test, đa dụng | EBS gp2/gp3 |
| Big data, log, truy cập tuần tự / ít truy cập, rẻ nhất | st1 / sc1 (HDD, không làm boot volume) |
| Nhiều EC2 cùng gắn 1 block volume | Multi-Attach, chỉ io1/io2, cùng 1 AZ (khác AZ → EFS) |
| I/O cao nhất, dữ liệu tạm hoặc đã replicate | Instance store (mất khi stop/terminate, reboot thì còn) |

**Database**

| Thấy trong đề | Chọn |
| --- | --- |
| Giảm tải đọc RDS, reporting, analytics | Read Replica (async) |
| Aurora phân phối read | Reader endpoint; ghi → Cluster endpoint |
| Aurora tách production và reporting | Custom endpoint |
| Aurora replica không theo kịp lúc cao điểm | Aurora Auto Scaling (tối đa 15 replica) |
| Lambda + RDS, too many connections | RDS Proxy |
| Query lặp lại, cần dưới 1 mili giây | ElastiCache |
| DynamoDB đọc nhiều, microsecond | DAX |
| DynamoDB hot partition | Partition key high-cardinality, thêm suffix ngẫu nhiên |
| DynamoDB traffic không đoán trước, nhiều lúc nhàn rỗi | On-demand capacity mode |
| Schema thay đổi, scale lớn, key-value | DynamoDB |
| MongoDB, không đổi code | DocumentDB |
| GraphQL, mobile real-time | AppSync |
| RDS metric theo process/thread | Enhanced Monitoring |
| Query nào gây tải RDS | Performance Insights |
| RDS hết dung lượng | Storage Autoscaling |
| SQL Server → Aurora PostgreSQL, ít sửa code | Babelfish (+ SCT cho schema, DMS cho dữ liệu) |

**Mạng, CDN và compute**

| Thấy trong đề | Chọn |
| --- | --- |
| Static content toàn cầu, có cache, HTTP | CloudFront |
| Static IP, TCP/UDP, không cache, failover nhanh | Global Accelerator |
| Xử lý dữ liệu gần người dùng, at the edge | Lambda@Edge (sửa header nhẹ → CloudFront Functions) |
| Path/host routing | ALB; static IP, layer 4, UDP → NLB; firewall appliance → GWLB |
| Private subnet → S3/DynamoDB, rẻ nhất | Gateway Endpoint (miễn phí) |
| Nhiều VPC cần transitive, + on-prem | Transit Gateway |
| Hàng trăm VPC + VPN, single gateway, inter-region | Transit Gateway + TGW peering (CloudHub chỉ nối các site on-prem) |
| Chỉ mở 1 dịch vụ cho VPC khác | PrivateLink |
| 1 Direct Connect cho nhiều VPC/account | DX Gateway + Transit Gateway |
| Container serverless | Fargate; Kubernetes serverless → EKS on Fargate |
| Traffic burst vài giây, bình thường ít | API Gateway + Lambda |
| Bảo vệ backend khỏi spike | API Gateway throttling + caching |
| Ra API version mới, tăng dần traffic | API Gateway canary release |
| HPC, MPI, độ trễ thấp giữa node | Cluster placement group + EFA |
| Enhanced Networking, SR-IOV | ENA (ENI chỉ là card mạng ảo cơ bản) |
| Khởi động nhanh, giữ RAM | Hibernation (bật lúc launch) |
| Tải theo giờ biết trước | Scheduled scaling |
| Tải theo chu kỳ, khởi động lâu, launch trước | Predictive Scaling |
| Giữ ổn định một metric | Target tracking scaling |
| EKS scale node / scale pod | Cluster Autoscaler (Karpenter) / HPA |
| Launch EC2 lỗi sau N instance | Quota vCPU theo region → xin tăng (InsufficientCapacity → đổi AZ) |
| ASG scale theo memory, disk | CloudWatch agent đẩy metric → scaling policy |
| Lift-and-shift VM, downtime thấp / chỉ khảo sát on-prem | AWS MGN / Application Discovery Service |
| Lấy IP, instance ID, AZ từ trong instance | Instance metadata 169.254.169.254 (user-data là script bootstrap) |

**Analytics, streaming, AI**

| Thấy trong đề | Chọn |
| --- | --- |
| Streaming tùy biến, enhanced fan-out, real-time clickstream | Kinesis Data Streams (+ Lambda) |
| Đổ stream vào S3/OpenSearch, không code | Data Firehose |
| Đang dùng Kafka | MSK |
| ETL serverless, CSV → Parquet | Glue (chạy lại không trùng → Job Bookmark) |
| Big data Spark/Hadoop | EMR |
| SQL trên S3, serverless, ad-hoc | Athena (không dùng cho real-time stream) |
| Data warehouse, BI, SQL | Redshift |
| Query dữ liệu S3 cùng bảng Redshift, không nạp vào | Redshift Spectrum |
| Data lake nhiều account, quyền theo cột/hàng | Lake Formation |
| Âm thanh → chữ / chữ → giọng / dịch / cảm xúc | Transcribe / Polly / Translate / Comprehend |
| Ảnh, video / camera stream / tìm tài liệu | Rekognition / Kinesis Video Streams / Kendra |
| OCR tài liệu + nhận diện PHI y tế | Textract + Comprehend Medical |

## Secure (61% – ưu tiên 3)

**Identity và quản trị nhiều account**

| Thấy trong đề | Chọn |
| --- | --- |
| EC2/Lambda/ECS gọi AWS | IAM Role (không dùng access key) |
| Nhiều user cùng quyền | IAM Group + policy (Role không có thành viên) |
| Cross-account tạm thời | STS AssumeRole |
| Nhân viên SSO vào nhiều account | IAM Identity Center + permission sets (+ AD Connector nếu có AD) |
| SSO bằng AD on-prem qua SAML | AD FS + SAML 2.0 (AssumeRoleWithSAML) |
| LDAP không tương thích SAML | Custom identity broker + STS |
| Directory đơn giản, rẻ, không có AD sẵn | Simple AD |
| End-user đăng nhập app | Cognito |
| Mỗi user chỉ vào folder S3 riêng | Policy variable `${aws:username}` |
| Bắt buộc MFA | Điều kiện `aws:MultiFactorAuthPresent` |
| Đăng nhập RDS bằng token thay password | IAM DB Authentication |
| "unable to", chặn cả root user của account thành viên | SCP (không cấp quyền, không ảnh hưởng management account) |
| Phát hiện resource sai cấu hình, thiếu tag | AWS Config rule |
| Dựng nhiều account có sẵn guardrail | Control Tower |
| Chia sẻ TGW, subnet giữa account | AWS RAM |
| Tải báo cáo compliance (SOC, PCI) | AWS Artifact |

**Mã hóa và secret**

| Thấy trong đề | Chọn |
| --- | --- |
| Dữ liệu và key không bao giờ rời on-prem | Client-side encryption với master key tự giữ |
| SSE header | `x-amz-server-side-encryption`; có chữ customer → SSE-C |
| Mã hóa S3 có audit việc dùng key | SSE-KMS (header `aws:kms`). SSE-S3 header `AES256` |
| Toàn quyền key, xóa key material ngay | KMS custom key store trên CloudHSM |
| Mã hóa EBS có sẵn | Snapshot → copy có mã hóa → tạo volume mới |
| Ép HTTPS vào S3 | Bucket policy `aws:SecureTransport` |
| Secret cần auto rotation | Secrets Manager; không cần, rẻ → Parameter Store SecureString |
| Ẩn credentials trong env var Lambda | Customer managed KMS key + encryption helpers |
| Mã hóa Kubernetes Secrets | EKS secrets encryption với KMS |
| Redis yêu cầu password | Redis AUTH + transit encryption |
| WORM, không xóa/ghi đè | S3 Object Lock, Compliance mode (cần Versioning) |
| SSL tin cậy công khai, ít overhead | ACM public cert (miễn phí, tự gia hạn) |
| Cert ACM đặt ở region nào | Regional API, ALB → cùng region. CloudFront, edge-optimized API → us-east-1 |

**Mạng và bảo vệ ứng dụng**

| Thấy trong đề | Chọn |
| --- | --- |
| SQL injection, XSS | WAF gắn ALB/CloudFront; nhiều account → Firewall Manager |
| Request xấu, IP đổi liên tục | WAF rate-based rule |
| DDoS | CloudFront + Shield (Advanced) + WAF |
| Lọc traffic cấp VPC, FQDN | Network Firewall |
| Phát hiện threat / lỗ hổng phần mềm / PII trong S3 | GuardDuty / Inspector / Macie |
| SSH chỉ từ 1 IP | SG inbound TCP 22 từ `IP/32` |
| Chỉ app tier / ASG được vào DB | SG của DB: source = SG ID của app tier (không có source là instance ID; NACL chỉ dùng CIDR) |
| 1 instance lỗi, instance khác OK | Security Group; cả subnet lỗi → NACL hoặc route table |
| Security Group vs NACL | SG: instance, stateful, chỉ Allow · NACL: subnet, stateless, có Deny, số nhỏ xét trước |
| IPv6 chỉ đi ra | Egress-only Internet Gateway |
| Outbound Internet only cho private subnet | NAT Gateway ở public subnet + route từ private subnet |
| Copy traffic để phân tích | VPC Traffic Mirroring |
| Chỉ member xem nhiều file, không đổi URL | CloudFront Signed Cookies (1 file → Signed URL) |
| S3 chỉ truy cập qua CloudFront | OAC (presigned URL bỏ qua CloudFront) |
| Chống hotlink, truy cập tạm thời | Tắt public + S3 presigned URL |
| Public read cho mọi object | Bucket policy (Principal `*`) hoặc object ACL; CORS không cấp quyền |
| S3 chỉ truy cập từ 1 VPC | Access Point network origin VPC / `aws:SourceVpc` |
| Chia sẻ dữ liệu S3, người tải trả phí | Requester Pays (chặn truy cập ẩn danh) |
| Nhiều domain trên 1 ALB | SNI (miễn phí) |

## Cost-Optimized (63% – ưu tiên 4)

**S3 storage class**

| Thấy trong đề | Chọn |
| --- | --- |
| Ít truy cập (khoảng 1 lần/tháng) nhưng cần lấy ngay | Standard-IA |
| Không biết pattern truy cập | Intelligent-Tiering |
| Archive (1 lần/quý trở lên) nhưng lấy trong mili giây | Glacier Instant Retrieval |
| Archive, lấy trong vài phút đến vài giờ | Glacier Flexible Retrieval |
| Lưu 7–10 năm, rẻ nhất, chấp nhận chờ 12–48 giờ | Glacier Deep Archive |
| Lấy dưới 15 phút, luôn có capacity | Expedited + Provisioned capacity |
| Chuyển lớp hoặc tự xóa theo tuổi | Lifecycle Transition / Expiration |
| Biết trước sẽ ít truy cập | Ghi thẳng vào class rẻ, không qua lifecycle |
| Dữ liệu tạo lại được, ít truy cập, cần lấy ngay | One Zone-IA (rẻ hơn Standard-IA khoảng 20%, chỉ 1 AZ) |

**Compute và mua hàng**

| Thấy trong đề | Chọn |
| --- | --- |
| Workload chịu gián đoạn, batch, stateless | Spot |
| Chạy ổn định 1–3 năm | Reserved Instance / Savings Plans |
| Bỏ RI không dùng nữa | Bán Standard RI trên Marketplace (Convertible không bán được) |
| License theo socket/core (BYOL) | Dedicated Hosts |
| Máy dev chỉ dùng giờ hành chính | Tắt ngoài giờ bằng EventBridge Scheduler |
| Vẫn tính phí khi không running | RI, EBS, EIP không gắn |
| Đa domain trên ALB, rẻ | SNI (CloudFront Dedicated IP rất đắt) |
| Private subnet → S3/DynamoDB, tránh phí NAT | Gateway Endpoint |
| Dữ liệu lớn, mạng chậm | Offline transfer (Snow family / Data Transfer Terminal) |
| RDS dùng không thường xuyên, rẻ nhất | Snapshot + terminate, restore khi cần |
| Xử lý dữ liệu S3, giảm phí transfer | EC2 cùng region với bucket (S3 ↔ EC2 cùng region miễn phí) |

**Savings Plans và Reserved Instances**

| Kiểu mua | Áp dụng cho | Khi nào chọn |
| --- | --- | --- |
| Standard RI | 1 instance type cố định, 1 region | Giảm nhiều nhất, không đổi gì trong 1–3 năm |
| Convertible RI | Đổi được instance family | Muốn đổi family nhưng vẫn dùng RI |
| EC2 Instance Savings Plans | 1 instance family, 1 region | Đổi size hoặc OS trong family |
| Compute Savings Plans | Mọi EC2, mọi region, Fargate, Lambda | Đề nhắc Fargate, Lambda hoặc đổi family/region |
| Spot | Workload chịu gián đoạn | Batch, stateless, "can be interrupted" |

Quy tắc giảm giá: phương án càng ít linh hoạt nhưng vẫn thỏa yêu cầu thì giảm giá càng nhiều.

**Công cụ chi phí**

| Thấy trong đề | Chọn |
| --- | --- |
| Chi phí theo phòng ban | Tag + Cost Allocation Tags |
| Cảnh báo vượt ngân sách (kể cả theo dự báo) | Budgets |
| Xem, phân tích, dự báo chi phí bằng giao diện | Cost Explorer (không tự gửi cảnh báo) |
| Lấy hoặc dự báo chi phí bằng code | Cost Explorer API |
| Rightsizing, tìm EC2 dư cấu hình theo metric | Compute Optimizer |
| Phát hiện thiếu tag | Config `required-tags`; chặn tạo thiếu tag → SCP `aws:RequestTag` |
| Khuyến nghị best practice, tài nguyên bỏ không | Trusted Advisor |

## Con số cần thuộc

| Thông số | Giá trị |
| --- | --- |
| Lambda | Timeout 15 phút · RAM 10 GB · /tmp 10 GB |
| Fargate ephemeral storage | 20 GB mặc định, tối đa 200 GB |
| S3 single PUT / object tối đa | 5 GB / 5 TB |
| Multipart part | 5 MB – 5 GB, tối đa 10.000 part |
| Thời gian lưu tối thiểu | Standard-IA 30 ngày · Glacier IR/Flexible 90 ngày · Deep Archive 180 ngày |
| Glacier Flexible | Expedited 1–5 phút · Standard 3–5 giờ · Bulk 5–12 giờ |
| Glacier Deep Archive | Standard 12 giờ · Bulk 48 giờ |
| S3 Standard / One Zone-IA | ≥ 3 AZ / 1 AZ |
| EBS IOPS | gp2 3 IOPS/GiB · gp3 baseline 3.000, tối đa 16.000 · io1 tối đa 50 IOPS/GiB, 64.000/volume · io2 Block Express 1.000 IOPS/GiB, 256.000/volume |
| RDS automated backup | 1 – 35 ngày (lâu hơn → AWS Backup) |
| RDS Multi-AZ failover | 60 – 120 giây |
| RDS stopped | Tự start lại sau 7 ngày, vẫn tính phí storage |
| DynamoDB | PITR 35 ngày · 1 RCU = 4 KB · 1 WCU = 1 KB · item ≤ 400 KB · Streams lưu 24 giờ |
| Read Replica tối đa | Aurora 15 · MySQL/PostgreSQL 15 · Oracle/SQL Server 5 |
| SQS retention | Mặc định 4 ngày, tối đa 14 ngày |
| SQS FIFO | 300 TPS, 3.000 với batching · cửa sổ dedup 5 phút |
| Kinesis Data Streams retention | 24 giờ, tối đa 365 ngày |
| ASG cooldown mặc định | 300 giây |
| Spot interruption notice | 2 phút |
| Hibernation | RAM ≤ 150 GB · tối đa 60 ngày |
| VPC / subnet CIDR | /16 đến /28 · AWS giữ 5 IP mỗi subnet (/27 = 32 địa chỉ, 27 dùng được) |
| DNS của VPC | VPC CIDR base + 2 |
| Ephemeral ports | Mở 1024 – 65535 |
| IAM DB Auth token | Sống 15 phút |
| KMS automatic rotation | Mặc định 1 năm |
| ALB certificate | 25 cert mỗi listener |
| CloudWatch EC2 | Mặc định 5 phút · detailed 1 phút · RDS Enhanced Monitoring tới 1 giây |
| Port | SSH 22 · RDP 3389 · MySQL 3306 · PostgreSQL 5432 · MS SQL 1433 · NFS 2049 · SMB 445 · DNS 53 (UDP) |
