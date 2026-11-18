# SAA-C03 – Keyword và bẫy (tổng hợp từ 6 đề luyện)

Tài liệu này gộp keyword và bẫy rút ra từ 6 đề luyện thi SAA-C03, bỏ trùng và xếp theo 4 domain của đề thi thật. Đề thi gồm 65 câu trong 130 phút, cần khoảng 720/1000 điểm để đậu.

| Domain | Tỉ trọng trong đề |
| --- | --- |
| Design Secure Architectures | 30% |
| Design Resilient Architectures | 26% |
| Design High-Performing Architectures | 24% |
| Design Cost-Optimized Architectures | 20% |

High-Performing thường là domain có nhiều keyword nhất và dễ mất điểm nhất, nên nếu ít thời gian thì ưu tiên phần Bẫy, Câu hỏi phân loại và High-Performing.

## Cách dùng

1. Đọc phần **Bẫy lặp lại** và **Câu hỏi phân loại** trước mỗi lần làm đề. Đây là nguyên nhân của phần lớn câu sai.
2. Với mỗi bảng keyword: che cột bên phải, đọc cột trái rồi tự nói ra dịch vụ. Câu nào nói sai thì đánh dấu để ôn lại.
3. Phần **Con số cần thuộc** đọc lại vào sáng ngày thi.

## Bẫy lặp lại

Gộp từ cả 6 đề, sắp theo mức độ hay dính. Trước khi chốt đáp án, tự hỏi lại 8 câu này.

1. **Đọc sót chữ quyết định.** Gạch chân NOT, EXCEPT, LEAST, MOST cost-effective, LEAST operational overhead. "any", "only if", "always" trong đáp án thường sai.
2. **Dịch vụ nghe liên quan nhưng lạc đề, hoặc tính năng không tồn tại.** Ví dụ: S3 Cache, SQS priority, Parameter Store auto-rotate, Aurora Parallel Query, AWS Batch, Lex, SageMaker Clarify, Spot volume, SR-IOV volume, cài phần mềm lên S3, SCP gắn vào bucket. Tự hỏi: dịch vụ này có giải quyết đúng vấn đề đề nêu không?
3. **Một vế trong đáp án sai là cả đáp án sai.** Đáp án 2–3 vế phải kiểm từng vế: region, giao thức, đường đi, con số (DeleteMarkerCreated thay vì Delete, presigned URL thay vì OAC, cert ở us-east-1 cho Regional API, 800 IOPS cho volume io1 nhỏ).
4. **Có dịch vụ managed/native thì không tự build.** "LEAST overhead", "easily" → managed (Route 53 failover, DLM, Glue, Athena, Config managed rule, Predictive Scaling), không Lambda/EC2 tự viết, không snapshot rồi restore.
5. **Chọn giải pháp đắt khi đề không yêu cầu.** Multi-region, Dedicated IP, Firewall Manager cho 1 account đều là quá tay. Đề chỉ nói AZ sập thì Multi-AZ là đủ.
6. **Sai phạm vi (scope).** ELB và ASG chỉ trong 1 region; subnet và EBS nằm trong 1 AZ; VPC peering không transitive; quota EC2 tính theo region, không theo AZ.
7. **Nhầm phát hiện với ngăn chặn.** "unable to / prevent" → SCP, IAM policy. "detect / identify" → Config rule, GuardDuty.
8. **Nhầm chiều của quyền hoặc traffic.** Lambda gọi ra → execution role; ai gọi vào Lambda → resource policy. NACL stateless → phải mở outbound ephemeral port cho response. Role không có thành viên, nhiều user cùng quyền → IAM Group.

Thêm 3 tình huống hay gặp: workload "can be interrupted" → **Spot**; mạng công ty chậm, chuyển mất hàng tuần → **offline transfer**, mọi giải pháp online đều sai; tính năng chỉ bật lúc tạo (hibernation, mã hóa EBS/RDS) → phải tạo mới hoặc migrate.

**Hai lỗi rất hay lặp lại, kể cả khi đã ôn:**

- **Multi-AZ không phải để scale đọc.** "read-heavy, reporting, offload read" → Read Replica hoặc cache. Multi-AZ chỉ để failover, standby không đọc được.
- **Bài toán số instance theo AZ.** Luôn xét trường hợp xấu nhất: **tổng − AZ lớn nhất ≥ N**.

**Bẫy tinh vi hơn:**

9. **Chi tiết cấu hình thắng keyword chung.** Đề nói HPC nhưng Windows hoặc t3a → ENA, không EFA. HPC nhưng SMB/NTFS/AD → FSx for Windows, không Lustre. Wavelength → EC2 node group, không Fargate. Aurora *single instance* → không có replica để flip CNAME.
10. **Đáp án đúng kiến thức nhưng sai tình huống.** Global Accelerator không trỏ được tới on-prem (on-prem → Route 53 Weighted). Secrets Manager xoay vòng password, không tạo token 15 phút (token → IAM DB Auth).
11. **Mặc định đã có, không cần làm gì.** Log CloudTrail đã mã hóa SSE-S3 sẵn. S3 dưới 3.500 PUT / 5.500 GET mỗi giây mỗi prefix thì không cần đổi tên hay chia prefix. Mã hóa EBS tự lan sang snapshot, volume tạo từ snapshot và traffic instance ↔ volume.
12. **IAM: Condition nằm trong Allow hay Deny.** Condition IP trong Deny nghĩa là IP đó bị chặn. Explicit Deny luôn thắng.
13. **Câu chọn hai: hai đáp án phải bổ sung nhau.** Phát hiện + thông báo; peering + route table; scale pod (HPA) + scale node (Karpenter). Không chọn hai đáp án cùng vai trò.
14. **Thuật ngữ bịa.** "Receiving Timeout" không tồn tại (chỉ có visibility timeout). CloudHSM không có "snapshot" để khôi phục key. SSE dùng AES-256, không phải AES-128.
15. **Đọc đúng hướng traffic và loại trừ.** Chặn client vào theo quốc gia → WAF geo match, không phải Network Firewall (lọc FQDN outbound). Đề đã nói SG đúng mà instance vẫn unhealthy → kiểm tra health check.


16. **"Chạy được" nhưng không tối ưu.** Một trong những lỗi phổ biến nhất. Đọc cụm điều kiện (*MOST cost-effective*, *LEAST overhead*, *< 1 second*) **trước** khi đọc đáp án, rồi loại đáp án thừa thành phần.
17. **Chi tiết "multiple regions" gây nhiễu.** Xác định phạm vi thật của câu hỏi; nhiều khi chỉ cần Multi-AZ trong một region. Multi-AZ luôn cùng region; cross-region → Read Replica hoặc Aurora Global Database.
18. **Định nghĩa bị đảo ngược.** Vertical = máy mạnh hơn, Horizontal = thêm máy. KMS = managed; CloudHSM = HSM riêng, khách hàng kiểm soát độc quyền.
19. **In-transit hay at-rest.** SSL/TLS (`rds.force_ssl`) là in-transit; KMS, TDE là at-rest.
20. **IPv4 hay IPv6.** IPv4 private ra Internet → NAT Gateway; IPv6 chỉ đi ra → Egress-only IGW. Ra dịch vụ AWS (không phải Internet) → VPC endpoint.
21. **Static hay dynamic.** S3 chỉ phục vụ nội dung tĩnh; nội dung động cần EC2/ALB làm origin.
22. **Metric không tồn tại.** ALB và target group không có CPU metric; ECS service scale theo CPU/Memory của service.
23. **Mặc định và thời gian lưu tối thiểu.** Kinesis mặc định chỉ giữ 24 giờ ("default settings" là bẫy). Dữ liệu sống vài giờ → S3 Standard, không IA (tính tối thiểu 30 ngày).

## Câu hỏi phân loại nhanh

Khi gặp cặp dịch vụ dễ nhầm, đừng chọn theo keyword đầu tiên nhìn thấy. Tự hỏi đúng **một câu phân loại**, câu trả lời sẽ chỉ ra đáp án.

| Cặp dễ nhầm | Câu hỏi phân loại | Trả lời → Chọn |
| --- | --- | --- |
| EFS vs EBS io2 Multi-Attach | Cần **file** hay **block**? | File, nhiều AZ, hàng trăm instance → EFS · Block, cùng AZ, vài instance, IOPS cao → io2 Multi-Attach |
| Encryption | Dữ liệu **nằm yên** hay **đang di chuyển**? | At rest → KMS (instance có sẵn: snapshot → copy mã hóa → restore) · In transit → SSL/TLS, `rds.force_ssl` |
| SCP vs Permissions boundary | Giới hạn **cả account** hay **một số user/role**? | Cả account, kể cả root → SCP · Một số user/role, admin vẫn đủ quyền → Permissions boundary |
| Pilot light vs Warm standby | Ở region DR, app server đang **tắt** hay **bật**? | Tắt, chỉ có DB replicate → Pilot light · Bật, bản thu nhỏ → Warm standby |
| Chiến lược DR | RTO đề cho phép là bao lâu? | Vài giờ → Backup & Restore · Hàng chục phút → Pilot light · Vài phút → Warm standby · Gần 0 → Active-active. Dừng ở dòng **đầu tiên** đạt yêu cầu |
| SQS vs Firehose | Dữ liệu đi tới **tầng xử lý** hay **nơi lưu trữ**? | Worker lấy job ra xử lý → SQS · Đổ vào S3, Redshift, OpenSearch → Firehose |
| SQS vs SNS → nhiều SQS | Mỗi message cần **một** hay **nhiều** service xử lý? | Một (chia việc) → một SQS · Mỗi service một bản → SNS fan-out |
| SQS vs Step Functions | Cần **đệm** hay cần **điều phối**? | Đệm request, decouple → SQS · Nhiều bước, retry, chờ duyệt → Step Functions |
| CloudFront origin group vs Route 53 failover | Người dùng đi vào qua **cửa nào**? | Qua CloudFront → origin group · Thẳng tới endpoint → Route 53 failover |
| One Zone-IA vs Standard-IA | **Mất AZ** có chấp nhận được không? | Được (tạo lại được, bản phụ) → One Zone-IA · Không (bản duy nhất, compliance) → Standard-IA |
| Standard RI vs Savings Plans | Đề có nhắc **thay đổi** gì không? | Không đổi gì → Standard RI · Đổi size/OS trong family → EC2 Instance SP · Đổi family/region, có Fargate/Lambda → Compute SP |
| Dedicated Hosts vs Capacity Reservations | Đề nói về **license** hay **capacity**? | License, socket, core → Dedicated Hosts · Giữ chỗ theo AZ → Capacity Reservations |
| Placement group | Cần instance **sát nhau** hay **tách rời**? | Sát nhau, độ trễ thấp → Cluster · Mỗi cái một phần cứng, ít instance → Spread · Hệ phân tán lớn → Partition |
| ALB vs NLB vs GWLB | Cần đọc **URL/tên miền**, cần **static IP/UDP**, hay cần **firewall**? | URL, host → ALB · Static IP, TCP/UDP → NLB · Firewall appliance → GWLB |
| Aurora vs Redshift | **Giao dịch** hay **phân tích**? | Transactions, ACID (OLTP) → Aurora/RDS · Analytics, BI (OLAP) → Redshift |
| Lambda vs Fargate | Job chạy **bao lâu**? | Dưới 15 phút → Lambda · Dài hơn, vẫn serverless → Fargate |
| Function URL vs API Gateway | Cần **API keys, usage plans, throttling** không? | Không, chỉ là webhook → Function URL · Có → API Gateway |
| Transfer Acceleration vs CRR | Chậm lúc **upload** hay cần bản sao **sau khi lưu**? | Upload đường xa → Transfer Acceleration + multipart · Bản sao ở region khác → CRR |
| Memcached vs Redis | Cần **persistence, replication, sorted sets** không? | Không, multithreaded đơn giản → Memcached · Có → Redis |
| Secrets Manager vs Parameter Store vs IAM DB Auth | Cần **auto rotation**, cần **rẻ**, hay cần **token**? | Rotation → Secrets Manager · Rẻ, không rotation → Parameter Store · Token 15 phút từ IAM → IAM DB Auth |

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
| ENI vs ENA vs EFA | ENI: card mạng ảo cơ bản. ENA: Enhanced Networking (SR-IOV), cả Windows. EFA: HPC, OS-bypass, chỉ Linux và instance hỗ trợ (t3a không có) |
| SSE-S3 vs SSE-KMS vs SSE-C | SSE-S3: header `AES256`, AWS tự xoay key. SSE-KMS: header `aws:kms`, có audit CloudTrail. SSE-C: khách hàng tự giữ key |
| ACM public vs Private CA vs self-signed vs import | Public: miễn phí, được tin cậy, tự gia hạn. Private CA: nội bộ. Self-signed: không được tin cậy. Import: không tự gia hạn |
| CloudWatch metric chuẩn vs agent / Enhanced Monitoring | Metric chuẩn từ hypervisor (CPU, network). Memory, process cần agent hoặc Enhanced Monitoring |
| Predictive vs Scheduled vs Dynamic scaling | Predictive: ML dự báo, launch trước. Scheduled: giờ cố định. Dynamic: phản ứng sau khi tải tăng |
| Budgets vs Cost Explorer vs Compute Optimizer | Budgets: cảnh báo. Cost Explorer: xem, phân tích, dự báo. Compute Optimizer: rightsizing |
| RDS snapshot + terminate vs stop | Stop vẫn tính phí storage, tự start sau 7 ngày. Snapshot + terminate rẻ nhất cho DB dùng không thường xuyên |
| Instance metadata vs user-data | Metadata: thông tin instance (IP, ID, AZ). User-data: script bootstrap |
| MGN vs Discovery Service vs VM Import | MGN: rehost, replicate liên tục. Discovery: chỉ khảo sát. VM Import: import một lần |
| Aurora vs Redshift | Aurora: OLTP, giao dịch, ACID (tới 128 TiB). Redshift: OLAP, BI, columnar |
| Dịch vụ lưu trữ vs xử lý | "store results" → S3, Redshift, DynamoDB. EMR, Glue là xử lý, không phải nơi lưu |
| Kinesis Data Streams vs S3 + EMR | Real-time + replay → Kinesis. S3 + EMR là batch |
| CloudTrail vs X-Ray vs ALB access logs | CloudTrail: audit API call. X-Ray: tracing microservices. ALB access logs: chi tiết HTTP request, IP client |
| Secrets Manager vs IAM DB Auth | Secrets Manager: xoay vòng password. IAM DB Auth: token 15 phút gắn IAM user/role |
| Global Accelerator vs Route 53 Weighted | GA: endpoint chỉ là tài nguyên AWS. Chia % traffic có on-prem → Route 53 Weighted |
| Network Firewall vs WAF | Network Firewall: lọc cấp VPC, FQDN, IDS/IPS. WAF: HTTP layer 7, geo match, SQLi, XSS |
| CNAME vs Alias | Zone apex (root domain) → Alias A record. CNAME không dùng được ở zone apex |
| Volume Gateway cached vs stored vs Tape Gateway | Cached: dữ liệu chính ở S3, cache local. Stored: dữ liệu chính on-prem. Tape: thay tape backup |
| Volume Gateway cached vs ElastiCache | Cache dữ liệu on-prem → Volume Gateway cached. ElastiCache chạy trong AWS |
| Target tracking vs Step vs Simple scaling | Target tracking: giữ metric ở X%. Step: tự đặt threshold + set of adjustments. Simple: 1 alarm, 1 hành động |
| Cluster Autoscaler vs Karpenter | Karpenter: scale node, least overhead, không cần node group |
| Fargate vs AWS Batch | Fargate tối đa 16 vCPU / 120 GB mỗi task. Batch job lớn, song song, job queue → AWS Batch |
| Athena Federated Query vs AppSync pipeline resolvers | Athena Federated: query (đọc) nhiều nguồn. AppSync pipeline resolvers: GraphQL đọc + ghi nhiều bảng |
| App Runner vs SSM Run Command | App Runner: chạy web app container. Run Command: cấu hình EC2 không cần SSH/RDP |
| KMS vs CloudHSM | KMS: managed, tích hợp dịch vụ AWS. CloudHSM: HSM riêng, kiểm soát độc quyền, mất key là mất hẳn |
| ElastiCache Memcached vs Redis | Memcached: multithreaded, cache đơn giản, Auto Discovery. Redis: persistence, replication, leaderboard, Global Datastore |
| Aurora cloning vs snapshot vs Backtrack | Cloning: copy-on-write, tạo DB test gần như tức thì. Snapshot: chậm hơn. Backtrack: tua ngược DB tại chỗ, không restore |
| Dedicated Hosts vs Capacity Reservations | Dedicated Hosts: BYOL theo socket/core. On-Demand Capacity Reservations: giữ chỗ capacity theo AZ |
| API Gateway vs Lambda Function URL | Function URL: webhook đơn giản, least overhead. API Gateway: REST API đầy đủ (auth, throttling, cache) |
| Step Functions vs SQS | Step Functions: điều phối workflow. SQS: buffer, decouple (Step Functions không làm buffer) |
| Elastic Disaster Recovery vs RDS + DMS | Elastic DR: pilot light rẻ, RPO giây, RTO phút. RDS + DMS chạy sẵn là warm standby, đắt hơn |
| Vertical vs Horizontal scaling | Vertical: máy mạnh hơn. Horizontal: thêm máy |
| Cross-zone LB vs path routing | Cross-zone: chia đều tải giữa các AZ. Path routing: chia theo URL |
| Compute vs Storage Optimized | Compute (C): CPU cao. Storage Optimized (I, D, H): local storage, sequential I/O |
| Step Scaling vs Kinesis UpdateShardCount | Kinesis scale bằng shard, không dùng scaling policy của EC2 |
| GZIP vs Parquet | Parquet/ORC: columnar, Athena quét ít dữ liệu hơn. GZIP chỉ nén |

## Resilient (26% đề thi)

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
| Aurora có replica, primary lỗi | Flip CNAME, promote replica (~30 giây, theo priority tier 0–15) |
| Aurora single instance lỗi | Tạo instance mới cùng AZ, best-effort (không có replica để flip) |
| DR cross-region, RPO ~1 giây, RTO < 1 phút | Aurora Global Database |
| DR rẻ, RPO giây, RTO phút cho server on-prem/EC2 | AWS Elastic Disaster Recovery (pilot light) |
| RDS cross-region | Read Replica cross-region (Multi-AZ luôn cùng region) |
| NoSQL toàn cầu, low latency, nhiều region | DynamoDB Global Tables |
| NAT Gateway không là single point of failure | 1 NAT Gateway mỗi AZ, private subnet trỏ NAT cùng AZ |
| Trang dự phòng khi app sập | Route 53 Failover routing → S3 static website |
| Chỉ sang region phụ khi region chính lỗi | Route 53 Failover routing + health check |
| Tất cả site cùng chạy | Route 53 Active-Active + health check |
| Chia % traffic, canary, migrate on-prem → AWS | Route 53 Weighted hoặc ALB weighted target groups |
| ALB báo unhealthy dù SG đúng | Kiểm tra health check (path, port, protocol) |
| Region sập, downtime thấp nhất | Resource chạy sẵn ở region 2 + Route 53 failover (restore snapshot mất hàng giờ) |
| CloudFront lỗi 5xx, tự chuyển origin | CloudFront origin group (origin failover, 2 origin) |
| HA cho nội dung động qua CloudFront | Origin group gồm 2 EC2/ALB ở khác AZ (S3 chỉ cho nội dung tĩnh) |
| Backup Direct Connect | DX thứ 2, hoặc Site-to-Site VPN |
| Request bị mất khi tải đột biến | Đệm bằng SQS, ASG scale theo backlog (Step Functions không làm buffer) |
| Decouple, xử lý bất đồng bộ | SQS (pull) |
| Exactly-once, đúng thứ tự | SQS FIFO |
| Message lỗi lặp lại làm nghẽn queue | Dead-letter queue + maxReceiveCount |
| Consumer SQS chết giữa chừng | Message hiện lại cho consumer khác sau visibility timeout |
| Ngăn consumer khác nhận cùng message | Visibility timeout |
| Empty responses, giảm chi phí polling | SQS long polling |
| SQS + SLA thời gian xử lý | ASG scale theo `ApproximateAgeOfOldestMessage` |
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
| Thu log / làm việc trước khi terminate | Lifecycle hook `Terminating:Wait` + EventBridge (*Lifecycle Action*) + Lambda/SSM |
| ASG flapping, scale liên tục | Tăng cooldown hoặc nâng threshold |
| Session bị mất khi instance bị terminate | Lưu session ra ElastiCache hoặc DynamoDB (sticky sessions vẫn mất khi instance chết) |
| Backup tập trung nhiều service, > 35 ngày, cross-account | AWS Backup (DLM chỉ cho EBS) |
| Chống xóa nhầm object S3 | Versioning + MFA Delete |
| Log app Elastic Beanstalk không mất khi instance bị thay | Đẩy log lên S3 / CloudWatch Logs (không chỉ lưu trên EBS) |
| S3 sống sót khi region sập | Cross-Region Replication (cần Versioning) |
| Redshift DR khi region sập | Cross-Region Snapshot Copy |

## High-Performing (24% đề thi, nhiều keyword nhất)

Domain này hỏi: chọn đúng loại storage, database, mạng và compute cho tải trọng.

**Storage**

| Thấy trong đề | Chọn |
| --- | --- |
| Linux, NFSv4, POSIX, hàng nghìn EC2 / nhiều AZ cùng mount | EFS |
| Windows, SMB, NTFS, Active Directory, DFS (kể cả workload HPC) | FSx for Windows File Server |
| HPC, ML, tốc độ rất cao, liên kết S3, POSIX | FSx for Lustre (hot) + S3 (cold) |
| EFS cho hàng trăm client song song | EFS Max I/O + Provisioned Throughput |
| NetApp, đa giao thức NFS + SMB + iSCSI, Windows block Multi-AZ | FSx for NetApp ONTAP |
| Hybrid NFS/SMB, cache on-prem, file thành object S3 | S3 File Gateway |
| Hybrid iSCSI, dữ liệu chính ở S3, cache local, không mở rộng storage on-prem | Volume Gateway cached |
| Hybrid iSCSI, dữ liệu chính on-prem, backup lên AWS | Volume Gateway stored |
| Không có virtualization on-prem | Storage Gateway hardware appliance |
| Thay tape backup | Tape Gateway |
| Chuyển dữ liệu 1 lần (online) | DataSync (Storage Gateway là hybrid lâu dài) |
| SFTP/FTP managed vào S3/EFS | Transfer Family |
| File > 5 GB | Multipart Upload |
| Download file lớn, song song | S3 Byte-Range Fetches |
| Request S3 cao | Mỗi prefix 3.500 PUT / 5.500 GET mỗi giây; dưới mức này không cần làm gì |
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
| OLTP, ACID, dữ liệu lớn và tăng trưởng | Aurora (tới 128 TiB) |
| OLAP, BI, columnar | Redshift |
| Graph, quan hệ phức tạp | Neptune |
| Copy DB nhanh sang test/staging | Aurora cloning (copy-on-write) |
| Tua ngược DB về thời điểm trước, không restore | Aurora Backtrack |
| Session store, cache đơn giản, multithreaded | ElastiCache for Memcached |
| Persistence, replication, leaderboard | ElastiCache for Redis |
| Millisecond, IoT, key-value | DynamoDB |
| MongoDB, không đổi code | DocumentDB |
| GraphQL, mobile real-time, đọc/ghi nhiều nguồn | AppSync (pipeline resolvers) |
| RDS metric theo process/thread | Enhanced Monitoring |
| Query nào gây tải RDS | Performance Insights |
| RDS hết dung lượng | Storage Autoscaling |
| SQL Server → Aurora PostgreSQL, ít sửa code | Babelfish (+ SCT cho schema, DMS cho dữ liệu) |

**Mạng, CDN và compute**

| Thấy trong đề | Chọn |
| --- | --- |
| Static content toàn cầu, có cache, HTTP | CloudFront |
| Static IP, TCP/UDP, không cache, failover nhanh | Global Accelerator |
| 5G edge, single-digit ms cho mobile | AWS Wavelength (EKS: EC2 node group, Fargate không chạy ở Wavelength) |
| Zone apex / root domain → ALB, CloudFront | Route 53 Alias A record |
| Xử lý dữ liệu gần người dùng, at the edge | Lambda@Edge (sửa header nhẹ → CloudFront Functions) |
| Path/host routing | ALB path / host conditions; static IP, layer 4, UDP → NLB; firewall appliance → GWLB |
| Chia đều tải giữa các AZ | Cross-zone load balancing |
| Instance không truy cập được từ Internet | Kiểm tra route `0.0.0.0/0 → IGW` |
| Nối VPC nhiều region + IPS | Transit Gateway + Network Firewall |
| Nối các site on-prem với nhau qua DX | Direct Connect SiteLink |
| Quản lý, theo dõi địa chỉ IP | VPC IPAM |
| Private subnet → S3/DynamoDB, rẻ nhất | Gateway Endpoint (miễn phí) |
| Nhiều VPC cần transitive, + on-prem | Transit Gateway |
| Hàng trăm VPC + VPN, single gateway, inter-region | Transit Gateway + TGW peering (CloudHub chỉ nối các site on-prem) |
| Chỉ mở 1 dịch vụ cho VPC khác | PrivateLink |
| 1 Direct Connect cho nhiều VPC/account | DX Gateway + Transit Gateway |
| Kết nối dedicated, ổn định, không qua Internet | Direct Connect |
| Tăng throughput VPN | Transit Gateway + ECMP (BGP) |
| Nối 2 VPC private, kể cả khác region | VPC peering + route table cả hai phía |
| On-prem truy cập S3 qua DX bằng private IP | Interface endpoint (PrivateLink) cho S3 |
| Container serverless | Fargate; Kubernetes serverless → EKS on Fargate |
| Batch job song song, cần nhiều vCPU/RAM, job queue | AWS Batch |
| Tác vụ ngắn, dữ liệu nhỏ, chạy thưa | Lambda (không dùng EC2 chạy 24/7) |
| Cấu hình EC2 không cần SSH/RDP | SSM Run Command |
| Virtual desktop | WorkSpaces |
| Traffic burst vài giây, bình thường ít / REST API cost-effective | API Gateway + Lambda |
| Webhook đơn giản cho Lambda, least overhead | Lambda Function URL |
| Đưa Docker app lên nhanh, AWS lo hạ tầng | Elastic Beanstalk |
| ECS service scaling / scale EC2 cho ECS cluster | Theo CPU/Memory của service / Capacity Provider |
| Bảo vệ backend khỏi spike | API Gateway throttling + caching |
| Ra API version mới, tăng dần traffic | API Gateway canary release |
| HPC, MPI, độ trễ thấp giữa node | Cluster placement group + EFA |
| Enhanced Networking, SR-IOV, PPS cao | ENA (ENI chỉ là card mạng ảo cơ bản) |
| Local storage, sequential I/O | Storage Optimized instance (I, D, H) |
| Cluster placement group thiếu capacity | Stop rồi start lại toàn bộ instance |
| Giữ chỗ capacity theo AZ | On-Demand Capacity Reservations |
| Khởi động nhanh, giữ RAM | Hibernation (bật lúc launch) |
| Tải theo giờ biết trước | Scheduled scaling |
| Tải theo chu kỳ, khởi động lâu, launch trước | Predictive Scaling |
| Giữ ổn định một metric ở X% | Target tracking scaling |
| Burst traffic, scale theo mức vượt ngưỡng, instance boot chậm | Step scaling + warm-up |
| EKS scale node / scale pod | Karpenter (least overhead) / HPA + Metrics Server |
| Launch EC2 lỗi sau N instance | Quota vCPU theo region → xin tăng (InsufficientCapacity → đổi AZ) |
| ASG scale theo memory, disk | CloudWatch agent đẩy metric → scaling policy |
| Lift-and-shift VM, downtime thấp / chỉ khảo sát on-prem | AWS MGN / Application Discovery Service |
| Lấy IP, instance ID, AZ từ trong instance | Instance metadata 169.254.169.254 (user-data là script bootstrap) |

**Analytics, streaming, AI**

| Thấy trong đề | Chọn |
| --- | --- |
| Streaming tùy biến, real-time + replay, nhiều consumer | Kinesis Data Streams (+ Lambda) |
| Đổ stream vào S3/OpenSearch, không code | Data Firehose |
| Kinesis chậm, cần thêm throughput | Tăng shard (`UpdateShardCount`) |
| SMS hai chiều | AWS End User Messaging SMS |
| Đang dùng Kafka | MSK |
| ETL serverless, CSV → Parquet | Glue (chạy lại không trùng → Job Bookmark) |
| Big data Spark/Hadoop | EMR |
| SQL trên S3, serverless, ad-hoc | Athena (không dùng cho real-time stream) |
| OpenSearch + trực quan hóa, least overhead | OpenSearch Dashboards |
| Data warehouse, BI, SQL | Redshift |
| Query dữ liệu S3 cùng bảng Redshift, không nạp vào | Redshift Spectrum |
| Lưu kết quả xử lý stream | S3, Redshift, DynamoDB, OpenSearch (không phải EMR) |
| Data lake nhiều account, quyền theo cột/hàng | Lake Formation |
| Âm thanh → chữ / chữ → giọng / dịch / cảm xúc | Transcribe / Polly / Translate / Comprehend |
| Ảnh, video / camera stream / tìm tài liệu | Rekognition / Kinesis Video Streams / Kendra |
| OCR tài liệu + nhận diện PHI y tế | Textract + Comprehend Medical |

## Secure (30% đề thi)

**Identity và quản trị nhiều account**

| Thấy trong đề | Chọn |
| --- | --- |
| EC2/Lambda/ECS gọi AWS | IAM Role (không dùng access key) |
| Người dùng gọi API bằng CLI/SDK | Access keys + permissions (cần cả xác thực lẫn phân quyền) |
| Least privilege | Action cụ thể + ARN cụ thể, không wildcard |
| Tách môi trường, quản lý tập trung | Organizations + cross-account role |
| Nhiều user cùng quyền | IAM Group + policy (Role không có thành viên) |
| Cross-account tạm thời | STS AssumeRole |
| Nhân viên SSO vào nhiều account | IAM Identity Center + permission sets (+ AD Connector nếu có AD) |
| SSO bằng AD on-prem qua SAML | AD FS + SAML 2.0 (AssumeRoleWithSAML) |
| LDAP không tương thích SAML | Custom identity broker + STS |
| Directory đơn giản, rẻ, không có AD sẵn | Simple AD |
| End-user đăng nhập app | Cognito |
| Mỗi user chỉ vào folder S3 riêng | Policy variable `${aws:username}` |
| Phân quyền UAT vs Production trong cùng account | Tag + IAM condition (ABAC) |
| Condition IP nằm trong Deny | IP đó bị chặn; explicit Deny luôn thắng |
| IAM users/roles → quyền Kubernetes | EKS access entries + access policies |
| AD on-prem có sẵn, chỉ cần proxy | AD Connector |
| Bắt buộc MFA | Điều kiện `aws:MultiFactorAuthPresent` |
| Đăng nhập RDS bằng token thay password | IAM DB Authentication (MySQL, MariaDB, PostgreSQL; không hỗ trợ SQL Server) |
| "unable to", chặn cả root user của account thành viên | SCP (không cấp quyền, không ảnh hưởng management account) |
| Phát hiện resource sai cấu hình, thiếu tag | AWS Config rule |
| Audit ai gọi API gì | CloudTrail (log đã SSE-S3 sẵn) |
| Audit đọc/ghi từng object S3 | CloudTrail Data Events |
| Giám sát service quota | Service Quotas Automatic Management + User Notifications |
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
| Dedicated HSM, mất key là mất hẳn | CloudHSM (AWS không truy cập và không khôi phục được key) |
| Mã hóa EBS | KMS; tự lan sang snapshot, volume từ snapshot, traffic instance ↔ volume |
| Mã hóa EBS có sẵn | Snapshot → copy có mã hóa → tạo volume mới |
| Ép HTTPS vào S3 | Bucket policy `aws:SecureTransport` |
| Bắt buộc SSL tới RDS (in-transit) | `rds.force_ssl` + root CA |
| Tự động mã hóa mọi EBS mới | EBS Encryption by Default (thiết lập theo region) |
| Account khác upload, chủ bucket cần toàn quyền | `bucket-owner-full-control` / Object Ownership bucket owner enforced |
| Nhiều account truy cập một bucket | Bucket policy |
| ACM sắp hết hạn | `DaysToExpiry` / ACM event → EventBridge → SNS |
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
| Chặn theo quốc gia, cho phép vài IP | WAF: IP set Allow (priority cao) + geo match Block |
| DNS spoofing | DNSSEC (HTTPS không giải quyết) |
| Request xấu, IP đổi liên tục | WAF rate-based rule |
| DDoS | CloudFront + Shield (Advanced) + WAF |
| Lọc traffic cấp VPC, FQDN, IDS/IPS | Network Firewall |
| Phát hiện threat / lỗ hổng phần mềm / PII trong S3 | GuardDuty / Inspector / Macie (→ EventBridge → SNS để thông báo) |
| SSH chỉ từ 1 IP | SG inbound TCP 22 từ `IP/32` |
| Chặn nhanh vài IP cụ thể | NACL Deny rule (SG không có Deny) |
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

## Cost-Optimized (20% đề thi)

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
| Pattern đã biết | Chọn thẳng class phù hợp, không cần Intelligent-Tiering |
| Dữ liệu chỉ sống vài giờ / vài ngày | S3 Standard (IA tính tối thiểu 30 ngày) |
| Athena tốn tiền, chậm | Chuyển sang Parquet/ORC + partitioning |
| Dữ liệu tạo lại được, ít truy cập, cần lấy ngay | One Zone-IA (rẻ hơn Standard-IA khoảng 20%, chỉ 1 AZ) |

**Compute và mua hàng**

| Thấy trong đề | Chọn |
| --- | --- |
| Workload chịu gián đoạn, batch, stateless | Spot |
| Có cả workload critical và workload chịu gián đoạn | Reserved cho phần critical + Spot cho phần còn lại |
| Tác vụ vài giây mỗi ngày | Lambda thay vì EC2 chạy 24/7 |
| Chạy ổn định 1–3 năm | Reserved Instance / Savings Plans |
| Bỏ RI không dùng nữa | Bán Standard RI trên Marketplace (Convertible không bán được) |
| License theo socket/core (BYOL) | Dedicated Hosts |
| Máy dev chỉ dùng giờ hành chính | Tắt ngoài giờ bằng EventBridge Scheduler |
| Vẫn tính phí khi không running | RI, EBS, EIP không gắn |
| Đa domain trên ALB, rẻ | SNI (CloudFront Dedicated IP rất đắt) |
| Private subnet → S3/DynamoDB, tránh phí NAT | Gateway Endpoint |
| Dữ liệu lớn, mạng chậm | Offline transfer (Snow family / Data Transfer Terminal) |
| RDS dùng không thường xuyên, rẻ nhất | Snapshot + terminate, restore khi cần |
| DB dev/test không cần HA | Bỏ Multi-AZ cho dev/test |
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
| Fargate | Mỗi task tối đa 16 vCPU, 120 GB RAM · ephemeral storage 20 GB mặc định, tối đa 200 GB |
| S3 single PUT / object tối đa | 5 GB / 5 TB |
| Multipart | Khuyến nghị > 100 MB, bắt buộc > 5 GB · part 5 MB – 5 GB, tối đa 10.000 part |
| S3 request mỗi prefix | 3.500 PUT/COPY/POST/DELETE, 5.500 GET/HEAD mỗi giây |
| S3 / EBS encryption | AES-256 |
| Thời gian lưu tối thiểu | Standard-IA 30 ngày · Glacier IR/Flexible 90 ngày · Deep Archive 180 ngày |
| Glacier Flexible | Expedited 1–5 phút · Standard 3–5 giờ · Bulk 5–12 giờ |
| Glacier Deep Archive | Standard 12 giờ · Bulk 48 giờ |
| S3 Standard / One Zone-IA | ≥ 3 AZ / 1 AZ |
| EBS IOPS | gp2 3 IOPS/GiB · gp3 baseline 3.000, tối đa 16.000 · io1 tối đa 50 IOPS/GiB, 64.000/volume · io2 Block Express 1.000 IOPS/GiB, 256.000/volume |
| RDS automated backup | 1 – 35 ngày (lâu hơn → AWS Backup) |
| RDS Multi-AZ failover | 60 – 120 giây |
| RDS dung lượng tối đa | 64 TiB (SQL Server 16 TiB) |
| Aurora | Tới 128 TiB · 6 bản sao trên 3 AZ · failover có replica ~30 giây, priority tier 0–15 |
| RDS stopped | Tự start lại sau 7 ngày, vẫn tính phí storage |
| DynamoDB | PITR 35 ngày · 1 RCU = 4 KB · 1 WCU = 1 KB · item ≤ 400 KB · Streams lưu 24 giờ |
| Read Replica tối đa | Aurora 15 · MySQL/PostgreSQL 15 · Oracle/SQL Server 5 |
| SQS retention | Mặc định 4 ngày, tối đa 14 ngày |
| SQS visibility timeout | Mặc định 30 giây, tối đa 12 giờ |
| SQS khác | Long polling tối đa 20 giây · delay queue tối đa 15 phút · message tối đa 256 KB |
| SQS FIFO | 300 TPS, 3.000 với batching · cửa sổ dedup 5 phút |
| Kinesis Data Streams | Retention mặc định 24 giờ, tối đa 365 ngày · mỗi shard ghi 1 MB/s (1.000 record/s), đọc 2 MB/s |
| ASG | Cooldown mặc định 300 giây · lifecycle hook timeout mặc định 1 giờ |
| Spot | Cảnh báo thu hồi 2 phút · giảm tới ~90% |
| Reserved / Savings Plans | Giảm tới ~72% |
| Hibernation | RAM ≤ 150 GB · tối đa 60 ngày |
| VPC / subnet CIDR | /16 đến /28 · AWS giữ 5 IP mỗi subnet (/27 = 32 địa chỉ, 27 dùng được) |
| DNS của VPC | VPC CIDR base + 2 |
| NACL | Ephemeral ports 1024 – 65535 · mặc định 20 rule mỗi chiều, tối đa 40 |
| Site-to-Site VPN | 2 tunnel mỗi connection, ~1,25 Gbps mỗi tunnel |
| EBS | Multi-Attach cùng AZ, tối đa 16 instance · Snapshot Archive khôi phục 24–72 giờ |
| Route 53 Multivalue | Tối đa 8 record healthy |
| Spread placement group | Tối đa 7 instance mỗi AZ |
| Global Accelerator | 2 static anycast IP |
| ENA | Băng thông tới 100 Gbps |
| ACM expiration event | Bắt đầu 45 ngày trước khi hết hạn |
| CloudFormation | Template version chỉ có `2010-09-09` · section bắt buộc duy nhất là `Resources` |
| ALB access logs | Ghi vào S3 mỗi 5 phút |
| IAM DB Auth token | Sống 15 phút, bắt buộc SSL |
| KMS automatic rotation | Mặc định 1 năm |
| ALB certificate | 25 cert mỗi listener |
| CloudWatch EC2 | Mặc định 5 phút · detailed 1 phút · RDS Enhanced Monitoring tới 1 giây |
| Port | SSH 22 · RDP 3389 · HTTPS 443 · MySQL 3306 · PostgreSQL 5432 · MS SQL 1433 · Oracle 1521 · NFS 2049 · SMB 445 · DNS 53 (UDP) |

## Kinh nghiệm thực tế

Phần này ghi lại hành trình ôn của một thành viên trong team đã thi đậu, để mọi người có kỳ vọng đúng và tránh các lỗi tương tự.

**Điểm exam mode trên đề luyện không cần cao mới đậu.** Điểm các đề luyện của thành viên này dao động từ 35% đến 50% ở chế độ thi thử, nhưng vẫn đậu đề thật. Đề luyện thường được cho là khó hơn đề thật một chút. Quan trọng hơn điểm số là **xu hướng tăng** và việc **sửa được các lỗi lặp lại**.

**Những cách ôn hiệu quả nhất:**

1. **Gộp keyword theo domain, không theo đề.** Ghi theo từng đề thì danh sách dài và trùng lặp. Gộp theo domain thì ngắn lại và thấy ngay chỗ yếu.
2. **Ghi keyword dạng "thấy trong đề → chọn dịch vụ"** thay vì ghi định nghĩa.
3. **Học bằng câu hỏi phân loại.** Nhiều lỗi xảy ra theo kiểu "lần trước chọn A sai, lần này chọn B, nhưng đề lần này lại cần A". Chỉ khi có tiêu chí phân biệt rõ (bảng Câu hỏi phân loại ở trên) thì mới hết dao động.
4. **Luyện cả tình huống ngược.** Sau khi sai một câu, hãy tìm thêm tình huống mà chính đáp án "bẫy" lại là đáp án đúng. Làm đúng được cả hai chiều mới là hiểu thật.
5. **Làm lại câu sai đến khi không còn câu nào**, rồi mới sang đề mới.

**Những lỗi lặp lại nhiều nhất:**

- Chọn phương án **mạnh hơn cho chắc** (multi-region khi chỉ cần Multi-AZ, Warm standby khi RTO cho phép vài giờ, 6 instance mỗi AZ khi 3 là đủ). Đề thi thưởng cho phương án **vừa đủ**.
- **Bỏ sót một con số hoặc điều kiện** trong đề: RPO 1 phút nhưng chọn snapshot hằng giờ, job chạy 20 phút nhưng chọn Lambda.
- **Chọn theo keyword vừa học gần đây** mà không đọc điều kiện của câu hiện tại.

**Mẹo trong phòng thi:**

1. **Đọc câu hỏi cuối và các điều kiện trước**, ghi nhanh ra nháp (*20 phút, RPO 1 phút, compliance, LEAST overhead…*), rồi mới đọc tình huống.
2. **Đối chiếu đáp án với từng điều kiện.** Vi phạm một điều kiện là loại.
3. **Câu "Select TWO/THREE":** các đáp án phải bổ sung cho nhau, không chọn hai đáp án làm cùng một việc.
4. **Gặp hai đáp án đều hợp lý:** chọn cái khớp nhiều điều kiện hơn và ít thành phần thừa hơn; có *LEAST overhead* thì ưu tiên dịch vụ managed.
5. **Dùng hết thời gian.** 130 phút cho 65 câu đủ để đọc kỹ và quay lại các câu đã đánh dấu. Đừng nộp sớm.
