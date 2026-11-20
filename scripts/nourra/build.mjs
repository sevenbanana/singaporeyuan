// 诺元控股官网（nourra.singaporeyuan.com）的页面生成脚本。
// 生成 index.html（中文）与 en/index.html（英文）。两种语言共用同一份结构，文案用 T(中文, English) 写在一起。
// 样式与交互不在这里：直接改 public/nourra/assets/site.css 和 main.js。
import fs from 'node:fs';
import path from 'node:path';

// 用法：node scripts/nourra/build.mjs public/nourra --site
//   带 --site：完整网页，写进站点的 public/nourra/（改完文案后跑这一条）
//   不带 --site：Artifact 预览版（中文页只写正文，由预览外壳补齐 <head>）
const ARGS = process.argv.slice(2);
const SITE_MODE = ARGS.includes('--site');
const OUT = ARGS.find((a) => !a.startsWith('--')) || path.resolve('out');
const SITE = 'https://nourra.ai';

/* ---------- 线性图标：24×24，1.5 描边，圆角端点 ---------- */
const ICONS = {
  'arrow-right': '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
  'arrow-up': '<path d="M12 19V5"/><path d="m6 11 6-6 6 6"/>',
  'check': '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  'copy': '<rect x="8.5" y="8.5" width="12" height="12" rx="2"/><path d="M15.5 8.5v-3a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h3"/>',
  'mail': '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 6.5 8.5 6.5 8.5-6.5"/>',
  'nodes': '<circle cx="12" cy="12" r="2.4"/><circle cx="5" cy="5.5" r="1.9"/><circle cx="19" cy="5.5" r="1.9"/><circle cx="5" cy="18.5" r="1.9"/><circle cx="19" cy="18.5" r="1.9"/><path d="m6.4 6.9 3.8 3.4M17.6 6.9l-3.8 3.4M6.4 17.1l3.8-3.4M17.6 17.1l-3.8-3.4"/>',
  'cloud': '<path d="M7.5 19h9.25a4.25 4.25 0 0 0 .5-8.47A5.75 5.75 0 0 0 6.2 9.6 4.75 4.75 0 0 0 7.5 19z"/>',
  'pulse': '<rect x="2.5" y="4" width="19" height="13" rx="2"/><path d="M6 10.5h2.5l1.5-3 2.5 6 1.5-3H18"/><path d="M9 20.5h6M12 17v3.5"/>',
  'rack': '<rect x="5" y="2.5" width="14" height="19" rx="1.5"/><path d="M5 8.5h14M5 14.5h14"/><path d="M8 5.5h.01M8 11.5h.01M8 17.5h.01"/><path d="M11 5.5h5M11 11.5h5M11 17.5h5"/>',
  'network': '<rect x="9" y="2.5" width="6" height="5" rx="1"/><path d="M12 7.5V12M5 12h14M5 12v4.5M12 12v4.5M19 12v4.5"/><rect x="3" y="16.5" width="4" height="4" rx="1"/><rect x="10" y="16.5" width="4" height="4" rx="1"/><rect x="17" y="16.5" width="4" height="4" rx="1"/>',
  'chip': '<rect x="6" y="6" width="12" height="12" rx="2"/><rect x="9.5" y="9.5" width="5" height="5" rx=".8"/><path d="M9.5 2.5V6M14.5 2.5V6M9.5 18v3.5M14.5 18v3.5M2.5 9.5H6M2.5 14.5H6M18 9.5h3.5M18 14.5h3.5"/>',
  'coolant': '<path d="M12 3c3.6 4.3 6 7.7 6 10.7a6 6 0 0 1-12 0C6 10.7 8.4 7.3 12 3z"/><path d="M9 14.6c1 .8 2 .8 3 0s2-.8 3 0"/>',
  'module': '<path d="M12 2.8 20.2 7.4v9.2L12 21.2l-8.2-4.6V7.4z"/><path d="M3.8 7.4 12 12l8.2-4.6M12 12v9.2"/>',
  'building': '<path d="M3 21h18"/><path d="M5 21V8.5L12 4l7 4.5V21"/><path d="M10 21v-4.5h4V21"/><path d="M8.5 10.5h1M14.5 10.5h1M8.5 13.5h1M14.5 13.5h1"/>',
  'bolt': '<path d="M13 2.5 5.5 13H11l-1 8.5L18.5 11H13z"/>',
  'site': '<path d="M12 21.5s6.5-5.8 6.5-11.4a6.5 6.5 0 1 0-13 0C5.5 15.7 12 21.5 12 21.5z"/><path d="m12.7 6.6-2.6 4h2.3l-.8 3.3 2.7-4.2H12z"/>',
  'phases': '<path d="M2.5 21h19"/><rect x="4" y="10" width="7" height="11" rx="1"/><rect x="13" y="6" width="7" height="15" rx="1" stroke-dasharray="2 2.2"/><path d="M6.5 13.5h2M6.5 16.5h2"/>',
  'package': '<path d="M3.5 7.5 12 3l8.5 4.5v9L12 21l-8.5-4.5z"/><path d="M3.5 7.5 12 12l8.5-4.5M12 12v9"/><path d="m7.8 5.2 8.4 4.6"/>',
  'tools': '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.1l-5.7 5.7a1.9 1.9 0 0 0 2.7 2.7l5.7-5.7a4 4 0 0 0 5.1-5.4l-2.6 2.6-2.3-.5-.5-2.3z"/>',
  'blueprint': '<path d="M5 3h10l4 4v14H5z"/><path d="M15 3v4h4"/><path d="M8 17h8M8 15.5v3M16 15.5v3"/><path d="M8 10h5"/>',
  'factory': '<path d="M3 20.5V11l5 3.2V11l5 3.2V11l5 3.2V4h3v16.5z"/><path d="M6.5 17.5h2M11.5 17.5h2"/>',
  'ship': '<path d="M2.5 14.5h19l-2.6 5H5.1z"/><rect x="5" y="9.5" width="4.5" height="5"/><rect x="9.5" y="9.5" width="4.5" height="5"/><rect x="9.5" y="4.5" width="4.5" height="5"/><path d="M17 14.5v-4h2"/>',
  'cycle': '<path d="M19.5 12a7.5 7.5 0 0 1-12.8 5.3"/><path d="M4.5 12a7.5 7.5 0 0 1 12.8-5.3"/><path d="M17.5 3v3.8h-3.8"/><path d="M6.5 21v-3.8h3.8"/>',
  'doc-check': '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4"/><path d="m9 14 2.2 2.2L15.5 12"/>',
  'gauge': '<path d="M4 18a8 8 0 1 1 16 0"/><path d="m12 18 4-5.5"/><circle cx="12" cy="18" r="1.2"/><path d="M12 10v1.5M7.3 12.3l1 1"/>',
  'key': '<circle cx="8" cy="15.5" r="4.5"/><path d="m11.3 12.2 8.7-8.7M16.5 7 19 9.5M14 9.5l2 2"/>',
  'pylon': '<path d="M8.5 21.5 12 2.5l3.5 19"/><path d="M5 7h14M6.5 11h11"/><path d="M9.6 15h4.8M9.6 15l4.6 6.5M14.4 15l-4.6 6.5"/>',
  'transformer': '<circle cx="9" cy="12" r="5.5"/><circle cx="15" cy="12" r="5.5"/><path d="M1.5 12h2M20.5 12h2"/>',
  'battery': '<rect x="2.5" y="7" width="17" height="10" rx="2"/><path d="M21.5 10.5v3"/><path d="m11.8 8.8-2.6 3.6h3l-1.4 2.8"/>',
  'switchboard': '<rect x="4" y="2.5" width="16" height="19" rx="1.5"/><path d="M8 7.5h8M8 12h8M8 16.5h8"/><path d="M10.5 6v3M13.5 10.5v3M10.5 15v3"/>',
  'cdu': '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 10h10l-2.5-2.5M17 14H7l2.5 2.5"/>',
  'heat': '<rect x="3" y="10" width="18" height="10.5" rx="1.5"/><circle cx="8" cy="15.25" r="2.8"/><circle cx="16" cy="15.25" r="2.8"/><path d="M7 6.5c.9-.9.9-2 0-3M12 6.5c.9-.9.9-2 0-3M17 6.5c.9-.9.9-2 0-3"/>',
  'fan': '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="1.4"/><path d="M12 10.6c-.4-2.8.6-5 3-5.6M13.2 12.7c2.6 1 4 3 3.6 5.4M10.8 12.7c-2.2 1.8-4.6 2.2-6.4.6"/>',
  'airflow': '<rect x="8.5" y="3" width="7" height="18" rx="1"/><path d="M8.5 9h7M8.5 15h7"/><path d="M2.5 8h3.5M2.5 12h3.5M2.5 16h3.5M18 8h3.5M18 12h3.5M18 16h3.5"/>',
  'hub': '<circle cx="12" cy="12" r="2.6"/><circle cx="12" cy="12" r="7"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>',
  'endtoend': '<circle cx="4.5" cy="12" r="2"/><circle cx="19.5" cy="12" r="2"/><path d="M6.5 12h11"/><path d="M10 9.5v5M14 9.5v5"/>',
  'shield': '<path d="M12 3 19.5 6v5.5c0 4.6-3.2 8.3-7.5 9.5-4.3-1.2-7.5-4.9-7.5-9.5V6z"/><path d="m8.8 12.2 2.2 2.2 4.3-4.6"/>',
  'link': '<path d="M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1"/><path d="M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1"/>',
  'globe': '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z"/>',
  'layers': '<path d="m12 3 9 4.8-9 4.8-9-4.8z"/><path d="m3 12 9 4.8 9-4.8M3 16.2 12 21l9-4.8"/>',
  'flow': '<rect x="2.5" y="9.5" width="5" height="5" rx="1"/><rect x="16.5" y="3.5" width="5" height="5" rx="1"/><rect x="16.5" y="15.5" width="5" height="5" rx="1"/><path d="M7.5 12h4.5M12 6v12M12 6h4.5M12 18h4.5"/>',
};

const sprite = () => `<svg class="sprite" width="0" height="0" aria-hidden="true" focusable="false"><defs>${Object.entries(ICONS)
  .map(([k, v]) => `<symbol id="i-${k}" viewBox="0 0 24 24">${v}</symbol>`).join('')}</defs></svg>`;
const ico = (name, cls = 'ico') => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><use href="#i-${name}"/></svg>`;
// 内联图标：每段路径带 pathLength="1"，供滚动时“描线”动画使用
const icoInline = (name, cls = 'ico ico--draw') => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${ICONS[name].replace(/<(path|circle|rect)\b/g, '<$1 pathLength="1"')}</svg>`;

// 标志：两根竖条 + 四个逐级上升的方块。四块自下而上依次点亮，带一圈柔光；LINK 只用于页脚的大号方块图形
const STEPS = [[37, 82, '.3'], [47, 62, '.55'], [57, 42, '.8'], [67, 22, '1']];
const LINK = 'M45 90 55 70 65 50 75 30';
const MARK = (uid) => `<svg class="mark" viewBox="14 14 92 92" width="38" height="38" aria-hidden="true"><defs><filter id="${uid}" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="3.4"/></filter></defs><rect class="mark-bar" x="18" y="18" width="18" height="84" rx="3"/><rect class="mark-bar" x="84" y="18" width="18" height="84" rx="3"/><g class="mark-glow" filter="url(#${uid})">${STEPS.map(([x, y], k) => `<rect class="mark-halo" x="${x}" y="${y}" width="16" height="16" rx="2" style="--k:${k}"/>`).join('')}</g>${STEPS.map(([x, y, o], k) => `<rect class="mark-step" x="${x}" y="${y}" width="16" height="16" rx="2" fill-opacity="${o}" style="--o:${o};--k:${k}"/>`).join('')}</svg>`;

// 中文大标题按分句成组：优先在逗号、冒号后换行，单句过长时组内照常折行
const phrase = (html) => html.split('<br>').map((part) => part
  .split(/(?<=[，：])/)
  .map((seg) => `<span class="ph">${seg}</span>`).join('')).join('<br>');
const phraseTitles = (html) => html.replace(/(<p class="(?:sec-title|contact-title)">)([\s\S]*?)(<\/p>)/g, (m, a, b, c) => a + phrase(b) + c);

function page(lang) {
  const zh = lang === 'zh';
  const T = (a, b) => (zh ? a : b);
  const base = zh ? '' : '../';
  const desc = T(
    '诺元控股总部位于新加坡，是智算中心（AIDC）运营商：获取土地与电力，整合机电供应链，完成工程建设，并承担长期运维与维保。',
    'Nourra Holdings, headquartered in Singapore, operates AI data centres end to end: land and power, the mechanical and electrical supply chain, construction, and long-term operations and maintenance.'
  );
  const lockupText = T('<b>诺元控股</b><small>NOURRA HOLDINGS</small>', '<b>NOURRA</b><small>HOLDINGS</small>');
  const eyebrow = (id, label, en, icon) =>
    `<h2 class="eyebrow" id="${id}"><span class="eyebrow-ico">${ico(icon)}</span><span>${label}</span>${zh && en ? `<span class="eyebrow-en">${en}</span>` : ''}</h2>`;

  const nav = [
    ['chain', T('产业链', 'Value chain')],
    ['inside', T('机房', 'Facility')],
    ['supply', T('供应链', 'Supply chain')],
    ['business', T('业务', 'Business')],
    ['footprint', T('布局', 'Footprint')],
    ['contact', T('联系', 'Contact')],
  ];
  const navList = nav.map(([id, l]) => `<li><a href="#${id}">${l}</a></li>`).join('');

  /* ---------- 产业链十层（自上而下：L10 → L01） ---------- */
  const roleTag = { core: T('诺元自有能力', 'Nourra’s own capability'), assist: T('诺元协同配置', 'Arranged by Nourra'), none: T('上下游', 'Upstream and downstream') };
  const roleShort = { core: T('自有能力', 'Our own'), assist: T('协同配置', 'Arranged'), none: T('上下游', 'Clients and partners') };
  const layers = [
    ['app', 'none', 'nodes', T('模型与应用', 'Models and applications'),
      T('大模型训练、推理服务和企业 AI 应用。它们决定了需要多少算力、放在哪里、什么时候要。', 'Model training, inference services and enterprise AI applications. They decide how much compute is needed, where, and when.'),
      T('我们的客户与合作伙伴所在的一层。', 'The layer our clients and partners work in.')],
    ['cloud', 'assist', 'cloud', T('算力服务与云', 'Compute services and cloud'),
      T('把硬件变成可以租用的算力：裸金属、GPU 云、按调用计费的模型接口。', 'Hardware turned into something you can rent: bare metal, GPU cloud, and model APIs billed by usage.'),
      T('为合作伙伴配置经核实的 GPU 算力与企业云资源。', 'We arrange verified GPU capacity and enterprise cloud for partners.')],
    ['ops', 'core', 'pulse', T('运行与维护', 'Operations'),
      T('集群上线之后的日常：值守、巡检、故障处理，以及机电与 IT 设备的定期保养、维修和备件更换。可用率是在这一层守住的。', 'Life after go-live: staffing, inspections and fault response, plus scheduled servicing, repair and spare parts for both facility and IT equipment. Availability is defended at this layer.'),
      T('自有驻场团队承担运维与维保，按服务等级协议交付。', 'Our own on-site teams run operations and maintenance against a service level agreement.')],
    ['deploy', 'core', 'rack', T('集群部署', 'Cluster deployment'),
      T('设备到货后的上架、布线、加电和联调。一个 GPU 集群有成千上万根线缆，装错一根就要返工。', 'Racking, cabling, power-up and commissioning once hardware arrives. A GPU cluster has thousands of cables, and one wrong run means rework.'),
      T('自有工程团队完成上架、布线与联调。', 'Our own engineering crews rack, cable and commission.')],
    ['net', 'assist', 'network', T('网络与存储', 'Networking and storage'),
      T('把成百上千台服务器连成一台机器的高速网络，以及训练数据所在的存储系统。', 'The high-speed fabric that makes hundreds of servers behave as one machine, and the storage that holds training data.'),
      T('按项目配置专项工程师，方案中写明负责人。', 'Specialist engineers are assigned per project and named in the plan.')],
    ['server', 'assist', 'chip', T('芯片与服务器', 'Chips and servers'),
      T('GPU、整机服务器和整柜系统。供给紧、交期长，是整条链上最稀缺的一环。', 'GPUs, servers and full-rack systems. Supply is tight and lead times are long. This is the scarcest link in the chain.'),
      T('核实货源与交付周期，货到后直接进入自有机房。', 'We verify supply and lead times. Hardware goes straight into our own facilities.')],
    ['cool', 'core', 'coolant', T('制冷与液冷', 'Cooling'),
      T('把机柜里的热量带走。新一代 GPU 整柜的发热量已超出风冷的能力，需要液体直接流经芯片。', 'Carrying heat out of the rack. The newest full-rack GPU systems produce more heat than air can remove, so liquid runs directly across the chips.'),
      T('在自建机房中按高密度标准设计与施工。', 'Designed and built to high-density standards in our own facilities.')],
    ['equip', 'core', 'module', T('机电设备与预制模块', 'M&amp;E equipment and prefabricated modules'),
      T('变压器、配电柜、不间断电源、液冷设备和预制方舱。它们的交期和质量，决定一座机房多久能建成、能用多久。', 'Transformers, switchgear, uninterruptible power, liquid-cooling equipment and prefabricated data hall modules. Their lead times and quality decide how soon a facility is built and how long it lasts.'),
      T('整合制造商与本地化产能，整体采购、集成并交付到现场。', 'We integrate manufacturers and local production, then procure, assemble and deliver to site as one package.')],
    ['mep', 'core', 'building', T('机房建筑与机电', 'Building, mechanical and electrical'),
      T('厂房结构、楼板承重、变配电、不间断电源和消防。机房的上限在这一层定下来。', 'Structure, floor loading, transformers and switchgear, uninterruptible power and fire protection. A facility’s ceiling is set here.'),
      T('自建智算机房；工程团队承担强弱电与机房改造。', 'We build our own data centres. Our crews handle electrical works and conversions.')],
    ['power', 'core', 'bolt', T('电力与土地', 'Power and land'),
      T('变电容量、购电安排和并网时间。电有多少、多久能通，决定了一座机房能建多大、多快上线。', 'Substation capacity, power purchase and grid connection dates. How much power, and how soon, decides how large a facility can be and how fast it goes live.'),
      T('寻找带电厂房与地块，核对电力容量、批文与上电时间。', 'We source powered buildings and land, and check power capacity, permits and power-on dates.')],
  ];
  const layerIdx = (i) => `L${String(10 - i).padStart(2, '0')}`;
  const layerButtons = layers.map(([k, role, icon, name], i) =>
    `<button type="button" class="layer layer--${role}" data-tab="${k}" data-role="${role}"><span class="layer-idx mono">${layerIdx(i)}</span><span class="layer-ico">${ico(icon)}</span><span class="layer-name">${name}</span><span class="layer-tag"><i aria-hidden="true"></i>${roleTag[role]}</span></button>`).join('\n          ');
  const layerPanels = layers.map(([k, role, icon, name, text, mine], i) =>
    `<div class="chain-panel" data-panel="${k}" hidden><div class="panel-head"><span class="panel-ico">${ico(icon)}</span><span class="panel-idx mono">${layerIdx(i)} / 10</span><span class="badge badge--${role}">${roleShort[role]}</span></div><h3>${name}</h3><p>${text}</p><div class="role role--${role}"><b>${T('诺元的位置', 'Where Nourra sits')}</b><p>${mine}</p></div></div>`).join('\n          ');

  /* ---------- 机房内部：部件 ---------- */
  const parts = [
    ['grid', 'power', 'pylon', T('市电', 'Grid'), 20, 52, T('市电接入', 'Grid connection'), 1,
      T('机房从电网取得高压电。能拿到多少容量、是否有两路独立进线，是选址时最先要确认的事。', 'The facility draws high-voltage power from the grid. How much capacity is available, and whether there are two independent feeds, is the first thing to confirm when choosing a site.')],
    ['tx', 'power', 'transformer', T('变压器', 'Transformer'), 200, 52, T('变压器', 'Transformers'), 2,
      T('把高压电降到设备可用的电压。变压器的总容量基本就是这座机房的上限。', 'They step high voltage down to what equipment can use. Total transformer capacity is, in practice, the ceiling of the facility.')],
    ['ups', 'power', 'battery', 'UPS', 380, 52, T('不间断电源', 'Uninterruptible power'), 3,
      T('市电中断的瞬间由电池顶上，直到备用发电机启动。GPU 训练任务一旦断电，损失的是数天的计算。', 'Batteries carry the load the instant the grid drops, until backup generators start. A GPU training run that loses power loses days of computation.')],
    ['pdu', 'power', 'switchboard', T('配电', 'Distribution'), 560, 52, T('配电', 'Power distribution'), 4,
      T('把电分到每一排、每一个机柜。高密度机柜需要更粗的母线和更高的配电规格。', 'Power is split to every row and every rack. High-density racks need heavier busbars and a higher distribution rating.')],
    ['rack', 'both', 'rack', '', 0, 0, T('机柜与 GPU 服务器', 'Racks and GPU servers'), 5,
      T('算力所在的地方。一个新一代 GPU 整柜的功率，相当于过去十几个普通机柜。', 'Where the compute is. One current full-rack GPU system draws as much as a dozen or more conventional racks used to.')],
    ['cdu', 'cool', 'cdu', 'CDU', 560, 262, T('冷却分配单元', 'Coolant distribution unit'), 2,
      T('液冷系统的心脏。它把冷却液送进每台服务器的冷板，再把带着热量的液体收回来。', 'The heart of a liquid-cooled hall. It sends coolant to the cold plates in every server and brings the heated liquid back.')],
    ['cooler', 'cool', 'heat', T('室外散热', 'Heat rejection'), 200, 262, T('室外散热', 'Heat rejection'), 1,
      T('把热量最终排到室外。在新加坡这样的热带气候里，这一环的设计直接影响电费。', 'Where the heat finally leaves the building. In a tropical climate like Singapore’s, this stage has a direct effect on the power bill.')],
  ];
  const pathName = { power: T('电力路径', 'Power path'), cool: T('冷却路径', 'Cooling path'), both: T('电力与冷却的终点', 'Where both paths end') };
  const pathCount = { power: 5, cool: 3 };
  const nodeSvg = parts.filter((p) => p[0] !== 'rack').map(([k, pth, icon, label, x, y]) =>
    `<g class="part" data-hl="${k}" data-path="${pth}"><rect class="node" x="${x}" y="${y}" width="130" height="80" rx="10"/><use class="node-ico" href="#i-${icon}" x="${x + 51}" y="${y + 12}" width="28" height="28"/><text x="${x + 65}" y="${y + 64}" text-anchor="middle">${label}</text></g>`).join('\n          ');
  let rackSvg = '';
  [768, 824, 880, 936].forEach((x0, r) => {
    rackSvg += `<rect class="rack-box" x="${x0}" y="52" width="44" height="290" rx="4"/>`;
    for (let u = 0; u < 11; u++) {
      const y = 76 + u * 24;
      rackSvg += `<path class="u" d="M${x0 + 7} ${y}h30"/>`;
      if (u < 10) rackSvg += `<rect class="led" x="${x0 + 8}" y="${y + 9}" width="5" height="3" rx="1" style="--d:${((r * 7 + u * 3) % 11) * 0.37}s"/>`;
    }
  });
  const chips = parts.map(([k, pth, icon, , , , chip]) => `<button type="button" class="chip" data-tab="${k}" data-path="${pth}">${ico(icon)}<span>${chip}</span></button>`).join('');
  const partPanels = parts.map(([k, pth, icon, , , , title, step, text]) => {
    const meta = pth === 'both' ? pathName.both : `${pathName[pth]} · ${step} / ${pathCount[pth]}`;
    return `<div data-panel="${k}" hidden><div class="panel-head"><span class="panel-ico">${ico(icon)}</span><span class="panel-idx mono">${meta}</span></div><h3>${title}</h3><p>${text}</p></div>`;
  }).join('');

  /* ---------- 供应链五步 ---------- */
  const supply = [
    ['blueprint', T('选型与设计配合', 'Specification'),
      T('按机柜密度和场地条件确定配电架构、制冷方式和模块规格，设备清单与工程图纸同步确定。', 'Rack density and site conditions set the power architecture, cooling method and module specification. The equipment list is fixed alongside the engineering drawings.'),
      T('把场地条件和客户要求转成一份完整的设备清单。', 'We turn site conditions and client requirements into one complete equipment list.')],
    ['factory', T('制造与预制', 'Manufacture and prefabrication'),
      T('配电柜、液冷设备和方舱模块在工厂完成制造、预装和出厂测试，现场工作量因此大幅减少。', 'Switchgear, liquid-cooling equipment and data hall modules are built, pre-assembled and factory-tested, which cuts the work left for site.'),
      T('整合全球供应链与东南亚本地化产能，统一管理进度与质量。', 'We integrate a global supply chain with local production in Southeast Asia, and manage schedule and quality as one.')],
    ['ship', T('物流与清关', 'Logistics and customs'),
      T('大型机电设备的跨境运输、报关和到场时间，要与现场土建进度对上。', 'Cross-border transport, customs clearance and arrival dates for heavy equipment have to line up with construction progress on site.'),
      T('统筹运输和到货顺序，按适用的贸易与出口管制规定办理。', 'We coordinate shipping and arrival sequence, under applicable trade and export control rules.')],
    ['tools', T('现场安装与调试', 'Installation and commissioning'),
      T('模块就位、接电、接管路，与机房其他系统联调。', 'Modules are set in place, connected to power and pipework, and commissioned with the rest of the facility.'),
      T('自有工程团队安装，与制造商共同完成调试。', 'Installed by our own engineering crews and commissioned together with the manufacturer.')],
    ['cycle', T('维保与备件', 'Maintenance and spares'),
      T('设备进入运行期之后的定期保养、故障维修和备件供应。', 'Scheduled servicing, repair and spare parts once the equipment is in operation.'),
      T('建立备件库存与维保计划，由驻场团队执行。', 'We set up spares stock and a maintenance plan, carried out by the on-site team.')],
  ];
  const nourraPart = T('诺元负责', 'Nourra’s part');
  const supplySteps = supply.map(([icon, name], i) =>
    `<li><button type="button" data-tab="s${i}"><span class="pipe-node">${ico(icon)}<i class="pipe-timer" aria-hidden="true"></i></span><span class="pipe-num mono">${String(i + 1).padStart(2, '0')}</span><span class="pipe-name">${name}</span></button></li>`).join('\n            ');
  const supplyPanels = supply.map(([icon, name, text, mine], i) =>
    `<div class="pipe-panel" data-panel="s${i}" hidden><div class="pipe-panel-main"><span class="panel-idx mono">${T(`第 ${i + 1} 步 / 共 5 步`, `Step ${i + 1} of 5`)}</span><h3>${name}</h3><p>${text}</p></div><div class="role role--core"><b>${ico('check', 'ico ico--sm')}${nourraPart}</b><p>${mine}</p></div></div>`).join('\n          ');

  /* ---------- 业务六条线 ---------- */
  const biz = [
    ['site', T('选址与电力', 'Site and power'), 'Site and power',
      T('寻找带电厂房与可开发地块，核对用地性质、楼板承重、电力容量、批文与上电时间。', 'We source powered buildings and developable land, and check zoning, floor loading, power capacity, permits and power-on dates.'),
      [T('带电厂房', 'Powered buildings'), T('地块评估', 'Land assessment'), T('电力接入', 'Grid connection')]],
    ['phases', T('机房建设', 'Development'), 'Development',
      T('以数兆瓦级的中小型智算机房为主，可分期扩容，交付到设备可直接上架的状态。', 'Mainly small and mid-sized AI data centres of a few megawatts, expandable in phases and handed over ready for hardware to be racked.'),
      [T('厂房改造', 'Building conversion'), T('模块化方舱', 'Modular data halls'), T('高功率密度', 'High density'), T('分期扩容', 'Phased expansion')]],
    ['package', T('供应链整合', 'Supply chain'), 'Supply chain',
      T('配电、液冷、预制模块等机电设备的整体采购、集成与交付，结合全球供应链与本地化生产。', 'Power distribution, liquid cooling and prefabricated modules procured, integrated and delivered as one package, combining a global supply chain with local production.'),
      [T('配电设备', 'Power equipment'), T('液冷系统', 'Liquid cooling'), T('预制模块', 'Prefabricated modules'), T('备品备件', 'Spare parts')]],
    ['tools', T('工程实施', 'Engineering'), 'Engineering',
      T('自有工程团队承担强弱电、布线、设备上架与机房改造，并以专业分包身份参与大型项目。', 'Our own crews deliver electrical and low-voltage works, cabling, racking and facility conversion, and join larger projects as a specialist subcontractor.'),
      [T('强电与弱电', 'Electrical and low-voltage'), T('布线与上架', 'Cabling and racking'), T('专业分包', 'Specialist subcontracting')]],
    ['pulse', T('运维与维保', 'Operations and maintenance'), 'Operations and maintenance',
      T('驻场团队负责日常运行、巡检与故障处理，并承担机电与 IT 设备的定期保养、维修和备件更换。', 'On-site teams run day-to-day operations, inspections and fault response, and handle scheduled servicing, repair and spare parts for facility and IT equipment.'),
      [T('驻场值守', 'On-site staffing'), T('巡检与故障处理', 'Inspection and fault response'), T('定期保养', 'Scheduled servicing'), T('维修与备件', 'Repair and spares')]],
    ['cloud', T('算力资源', 'Compute'), 'Compute',
      T('为合作伙伴配置经核实的 GPU 算力与企业云资源，在自有机房内完成部署。', 'Verified GPU capacity and enterprise cloud for our partners, deployed in our own facilities.'),
      [T('GPU 算力', 'GPU capacity'), T('整机采购', 'Server procurement'), T('企业云', 'Enterprise cloud')]],
  ];
  const bizCards = biz.map(([icon, name, en, text, scope]) =>
    `<li class="biz-card" data-spot><div class="biz-top"><span class="biz-ico">${ico(icon)}</span>${zh ? `<span class="biz-en mono">${en}</span>` : ''}</div><h3>${name}</h3><p>${text}</p><ul class="scope">${scope.map((s) => `<li>${s}</li>`).join('')}</ul></li>`).join('\n        ');

  /* ---------- 全球布局：真实经纬度 ---------- */
  const places = {
    sg: { lat: 1.3521, lon: 103.8198, name: T('新加坡', 'Singapore'), en: 'Singapore', d: T('总部，工程与运维团队所在地。', 'Headquarters, and home to our engineering and operations teams.') },
    my: { lat: 3.1390, lon: 101.6869, name: T('马来西亚', 'Malaysia'), en: 'Malaysia', d: T('重点发展区域，机房项目推进中；在吉隆坡和槟城设有办公室。', 'A priority market, with data centre projects under way and offices in Kuala Lumpur and Penang.') },
    id: { lat: -6.2088, lon: 106.8456, name: T('印度尼西亚', 'Indonesia'), en: 'Indonesia', d: T('重点发展区域，机房项目推进中。', 'A priority market, with data centre projects under way.') },
    jp: { lat: 35.6762, lon: 139.6503, name: T('日本', 'Japan'), en: 'Japan', d: T('算力资源与机房工程的合作网络。', 'Partner network for compute supply and data centre engineering.') },
    us: { lat: 39.50, lon: -98.35, name: T('美国', 'United States'), en: 'United States', d: T('长期布局的市场，推进机房项目与供应链合作。', 'A long-term market, where we are developing data centre projects and supply chain partnerships.') },
    nl: { lat: 52.3676, lon: 4.9041, name: T('荷兰', 'Netherlands'), en: 'Netherlands', d: T('欧洲市场的合作节点。', 'Our partner node for the European market.') },
    au: { lat: -33.8688, lon: 151.2093, name: T('澳大利亚', 'Australia'), en: 'Australia', d: T('大洋洲市场的合作节点。', 'Our partner node for Oceania.') },
  };
  const groups = { hq: T('总部', 'Headquarters'), site: T('机房项目', 'Data centre projects'), net: T('合作网络', 'Partner network') };
  const pinType = { sg: 'hq', my: 'site', id: 'site', jp: 'net', us: 'net', nl: 'net', au: 'net' };
  const mapPins = Object.entries(places).map(([k, p]) => {
    const t = pinType[k];
    const mini = k === 'my' || k === 'id';
    return mini
      ? `<span class="pin pin--site pin--mini" data-tab="${k}" data-lat="${p.lat}" data-lon="${p.lon}" aria-hidden="true"></span>`
      : `<button type="button" class="pin pin--${t}" data-tab="${k}" data-lat="${p.lat}" data-lon="${p.lon}" aria-label="${p.name}"><span class="pin-label">${p.name}</span></button>`;
  }).join('\n            ');
  // 东南亚放大图：经度 98°–110°E，纬度 6°N–8.5°S，每度 20 个单位
  const ix = (lon) => +((lon - 98) * 20).toFixed(1);
  const iy = (lat) => +((6 - lat) * 20).toFixed(1);
  const insetArc = (k) => {
    const a = places.sg, b = places[k];
    const x0 = ix(a.lon), y0 = iy(a.lat), x2 = ix(b.lon), y2 = iy(b.lat);
    const mx = (x0 + x2) / 2, my = (y0 + y2) / 2, dx = x2 - x0, dy = y2 - y0, len = Math.hypot(dx, dy);
    let nx = -dy / len, ny = dx / len; if (ny > 0) { nx = -nx; ny = -ny; }
    const k2 = 0.32;
    return `M${x0} ${y0}Q${(mx + nx * len * k2).toFixed(1)} ${(my + ny * len * k2).toFixed(1)} ${x2} ${y2}`;
  };
  const insetPins = ['sg', 'my', 'id'].map((k) => {
    const p = places[k];
    const left = ((p.lon - 98) / 12 * 100).toFixed(2), top = ((6 - p.lat) / 14.5 * 100).toFixed(2);
    return `<button type="button" class="pin pin--${pinType[k]} pin--inset pin--${k}" data-tab="${k}" style="left:${left}%;top:${top}%" aria-label="${p.name}"><span class="pin-label">${p.name}</span></button>`;
  }).join('');
  const placeBtn = (k) => {
    const p = places[k];
    return `<li><button type="button" class="place" data-tab="${k}"><b>${p.name}${zh ? `<span class="en">${p.en}</span>` : ''}</b><span class="place-desc">${p.d}</span></button></li>`;
  };
  const coord = (p) => `${Math.abs(p.lat).toFixed(2)}°${p.lat >= 0 ? 'N' : 'S'} ${Math.abs(p.lon).toFixed(2)}°${p.lon >= 0 ? 'E' : 'W'}`;

  /* ---------- 办公室 ---------- */
  const offices = [
    { tag: T('总部', 'Headquarters'), city: T('新加坡', 'Singapore'), hq: true,
      lines: ['101 Thomson Road, #28-03A', 'United Square', 'Singapore 307591'],
      q: '101 Thomson Road, #28-03A, United Square, Singapore 307591' },
    { tag: T('马来西亚', 'Malaysia'), city: T('吉隆坡', 'Kuala Lumpur'),
      lines: ['VO3-08-12, Sunway Velocity Designer Office', 'Lingkaran SV, Jalan Cochrane', '55100 Kuala Lumpur, Malaysia'],
      q: 'VO3-08-12, Sunway Velocity Designer Office, Lingkaran SV, Jalan Cochrane, 55100 Kuala Lumpur, Malaysia' },
    { tag: T('马来西亚', 'Malaysia'), city: T('槟城', 'Penang'),
      lines: ['Level 11, Wisma MTT', '26 Pengkalan Weld, 10300 George Town', 'Pulau Pinang, Malaysia'],
      q: 'Wisma MTT, 26 Pengkalan Weld, 10300 George Town, Pulau Pinang, Malaysia' },
  ];
  const officeCards = offices.map((o) =>
    `<li class="office${o.hq ? ' office--hq' : ''}"><span class="office-tag mono">${o.tag}</span><h4 class="office-city">${o.city}</h4><address translate="no">${o.lines.join('<br>')}</address><a class="office-map" href="https://www.google.com/maps/search/?api=1&amp;query=${encodeURIComponent(o.q)}" target="_blank" rel="noopener">${T('在 Google 地图中查看', 'View on Google Maps')}${ico('arrow-right', 'ico ico--sm')}</a></li>`).join('\n        ');

  /* ---------- 交付六关 ---------- */
  const gates = [
    ['site', T('选址与电力', 'Site and power'),
      T('确认用地性质、楼板承重、层高和可用电力容量。电力不落实，后面的一切都不成立。', 'Confirm land use, floor loading, ceiling height and available power. Until power is secured, nothing after it stands.'),
      T('现场踏勘，核对电力容量、批文与上电时间。', 'Site survey, and checks on power capacity, permits and power-on dates.')],
    ['doc-check', T('设计与报批', 'Design and approvals'),
      T('确定机柜密度、配电架构和制冷方案，完成图纸和相关审批。', 'Fix rack density, the power architecture and the cooling scheme, then complete drawings and approvals.'),
      T('组织设计，协调报批。', 'We organise design and coordinate approvals.')],
    ['building', T('土建与机电', 'Building and M&amp;E'),
      T('结构加固、变配电、不间断电源、制冷管路和消防施工。', 'Structural strengthening, transformers and switchgear, uninterruptible power, cooling pipework and fire protection.'),
      T('自有工程团队施工，按节点验收。', 'Built by our own engineering crews and accepted at milestones.')],
    ['rack', T('到货与上架', 'Arrival and racking'),
      T('服务器、网络设备和整柜系统到场，开箱、上架、布线、加电。', 'Servers, network equipment and full-rack systems arrive on site to be unpacked, racked, cabled and powered.'),
      T('核实货源与到货时间，自有团队完成上架与布线。', 'We verify supply and arrival dates. Our own crews rack and cable.')],
    ['gauge', T('联调与压测', 'Commissioning'),
      T('网络连通、满负荷运行和散热验证。问题在这一步暴露，比上线后暴露便宜得多。', 'Network connectivity, full-load running and thermal validation. Problems found here cost far less than problems found after go-live.'),
      T('配合专项工程师完成联调，出具测试记录。', 'We commission alongside specialist engineers and issue test records.')],
    ['key', T('交付与运维', 'Handover and operations'),
      T('集群移交使用方，进入长期运行。', 'The cluster is handed to its user and enters long-term operation.'),
      T('驻场团队按服务等级协议运维。', 'Our on-site team operates it against a service level agreement.')],
  ];
  const gateItems = gates.map(([icon, name, text, mine], i) =>
    `<li class="tl-item" data-gate="${i + 1}" data-name="${name}"><span class="tl-node">${ico(icon)}<i class="tl-check">${ico('check')}</i></span><div class="tl-card"><span class="tl-step mono">${T(`第 ${i + 1} 关`, `Gate ${i + 1}`)}</span><h3>${name}</h3><p>${text}</p><p class="tl-role"><b>${nourraPart}</b>${mine}</p></div></li>`).join('\n          ');

  /* ---------- 原则 ---------- */
  const principles = [
    ['endtoend', T('全过程负责', 'End to end'), T('从选址到维保，关键环节由自己的团队完成，责任清晰，不层层转包。', 'From site selection to maintenance, the critical work is done by our own people. Responsibility stays in one place.')],
    ['shield', T('合规经营', 'Compliance'), T('所有业务遵守适用的出口管制与制裁法规，合作前确认最终用户、使用地点与用途。', 'All business follows applicable export control and sanctions law. We confirm end user, location and use before we proceed.')],
    ['link', T('长期合作', 'Long-term partners'), T('我们与数量有限的合作伙伴建立长期关系，一切以书面约定为准。', 'We work with a limited number of partners over the long term, on written terms.')],
  ];

  const densityBands = zh
    ? [{ max: 15, kind: '传统企业机房', cooling: '风冷', icon: 'fan' }, { max: 40, kind: '高密度机房', cooling: '强化风冷或背板换热', icon: 'airflow' }, { max: 999, kind: 'GPU 整柜机房', cooling: '冷板式液冷', icon: 'coolant' }]
    : [{ max: 15, kind: 'Conventional enterprise hall', cooling: 'Air', icon: 'fan' }, { max: 40, kind: 'High-density hall', cooling: 'Enhanced air or rear-door heat exchange', icon: 'airflow' }, { max: 999, kind: 'Full-rack GPU hall', cooling: 'Direct-to-chip liquid', icon: 'coolant' }];
  const bandsAttr = JSON.stringify(densityBands).replace(/"/g, '&quot;');

  const head = zh
    ? `${SITE_MODE ? `<!doctype html>
<html lang="zh-Hans">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>诺元控股 Nourra Holdings｜AIDC 运营专家</title>` : `<title>NOURRA.AI 官网预览</title>
<meta name="claude:viewport-fit-sides" content="cover">`}
<meta name="description" content="${desc}">
<link rel="canonical" href="${SITE}/">
<link rel="alternate" hreflang="zh-Hans" href="${SITE}/">
<link rel="alternate" hreflang="en" href="${SITE}/en/">
<link rel="alternate" hreflang="x-default" href="${SITE}/">
<meta name="theme-color" content="#050D1C">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Nourra Holdings">
<meta property="og:title" content="诺元控股 Nourra Holdings｜AIDC 运营专家">
<meta property="og:description" content="${desc}">
<meta property="og:url" content="${SITE}/">
<meta name="twitter:card" content="summary">`
    : `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Nourra Holdings | AI data centre operator</title>
<meta name="description" content="${desc}">
<link rel="canonical" href="${SITE}/en/">
<link rel="alternate" hreflang="en" href="${SITE}/en/">
<link rel="alternate" hreflang="zh-Hans" href="${SITE}/">
<link rel="alternate" hreflang="x-default" href="${SITE}/">
<meta name="theme-color" content="#050D1C">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Nourra Holdings">
<meta property="og:title" content="Nourra Holdings | AI data centre operator">
<meta property="og:description" content="${desc}">
<meta property="og:url" content="${SITE}/en/">
<meta name="twitter:card" content="summary">`;

  const common = `
<link rel="icon" href="${base}assets/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@300;400;500;600&family=Noto+Sans+SC:wght@300;400;500;700${zh ? '' : '&family=Nunito+Sans:wght@300;400;500;600'}&display=swap">
<link rel="stylesheet" href="${base}assets/site.css">
<script type="application/ld+json">{"@context":"https://schema.org","@type":"Organization","name":"Nourra Holdings","legalName":"NOURRA HOLDINGS PTE. LTD.","alternateName":"诺元控股","url":"${SITE}","description":"${desc}","address":{"@type":"PostalAddress","streetAddress":"101 Thomson Road, #28-03A, United Square","postalCode":"307591","addressLocality":"Singapore","addressCountry":"SG"},"location":[{"@type":"Place","name":"Kuala Lumpur office","address":{"@type":"PostalAddress","streetAddress":"VO3-08-12, Sunway Velocity Designer Office, Lingkaran SV, Jalan Cochrane","postalCode":"55100","addressLocality":"Kuala Lumpur","addressCountry":"MY"}},{"@type":"Place","name":"Penang office","address":{"@type":"PostalAddress","streetAddress":"Level 11, Wisma MTT, 26 Pengkalan Weld","postalCode":"10300","addressLocality":"George Town","addressRegion":"Pulau Pinang","addressCountry":"MY"}}]}</script>`;

  const heroTitle = zh
    ? `<span class="line"><span>智算中心，</span></span><span class="line"><span>从一块地、一路电</span></span><span class="line"><span class="grad">到长期运营。</span></span>`
    : `<span class="line"><span>AI data centres,</span></span><span class="line"><span>from land and power</span></span><span class="line"><span class="grad">to long-term operation.</span></span>`;

  const stat = (n, label, unit = '') => `<div class="stat"><dt>${label}</dt><dd><b data-count="${n}">${n}</b>${unit ? `<span>${unit}</span>` : ''}</dd></div>`;

  const body = `${sprite()}
<a class="skip" href="#main">${T('跳到正文', 'Skip to content')}</a>

<header class="site-header" data-header>
  <div class="wrap header-row">
    <a class="lockup" href="#top" translate="no" aria-label="${T('诺元控股 NOURRA HOLDINGS', 'NOURRA HOLDINGS')}">${MARK('mark-glow-h')}<span class="lockup-text">${lockupText}</span></a>
    <nav class="site-nav" aria-label="${T('主导航', 'Main')}"><ul>${navList}</ul></nav>
    <div class="header-actions">
      <a class="lang" href="${zh ? 'en/' : '../'}" hreflang="${zh ? 'en' : 'zh-Hans'}" lang="${zh ? 'en' : 'zh-Hans'}" aria-label="${zh ? 'Switch to English' : '切换到中文'}">${zh ? 'EN' : '中文'}</a>
      <a class="btn btn--sm btn--glass" href="#contact">${T('合作洽谈', 'Talk to us')}</a>
      <button class="menu-btn" type="button" aria-expanded="false" aria-controls="menu" aria-label="${T('打开菜单', 'Open menu')}" data-label-open="${T('打开菜单', 'Open menu')}" data-label-close="${T('关闭菜单', 'Close menu')}"><span></span><span></span></button>
    </div>
  </div>
  <div class="scroll-progress" aria-hidden="true"><i></i></div>
</header>
<div class="menu" id="menu" hidden>
  <nav class="wrap" aria-label="${T('菜单', 'Menu')}"><ul>${nav.map(([id, l], i) => `<li style="--i:${i}"><a href="#${id}"><span class="mono">${String(i + 1).padStart(2, '0')}</span>${l}</a></li>`).join('')}</ul></nav>
</div>

<section class="hero" id="top" aria-labelledby="h-hero">
  <div class="hero-bg" aria-hidden="true">
    <canvas class="hero-canvas"></canvas>
    <div class="hero-light"></div>
    <div class="hero-grid"></div>
  </div>
  <div class="wrap hero-inner">
    <p class="kicker"><span class="kicker-dot" aria-hidden="true"></span><span>${T('AIDC 运营专家', 'AI data centre operator')}</span><span class="kicker-rule" aria-hidden="true"></span><span class="mono">SINGAPORE · ${coord(places.sg)}</span></p>
    <h1 class="hero-title" id="h-hero">${heroTitle}</h1>
    <p class="hero-lede">${T('诺元控股总部位于新加坡，负责一座算力中心的全过程：土地与电力、机电供应链、工程建设，以及长期运维。', 'Headquartered in Singapore, we take an AI data centre through its whole life: land and power, the M&amp;E supply chain, construction, and long-term operations.')}</p>
    <div class="hero-cta">
      <a class="btn btn--primary" href="#business" data-magnetic><span>${T('了解业务', 'Explore our business')}</span>${ico('arrow-right', 'ico ico--sm')}</a>
      <a class="btn btn--ghost" href="#footprint"><span>${T('全球布局', 'Our footprint')}</span></a>
    </div>
  </div>
  <div class="wrap hero-foot">
    <dl class="hero-stats">
      ${stat(10, T('产业链层级', 'Layers in the value chain'))}
      ${stat(6, T('自有能力层', 'Layers we run ourselves'))}
      ${stat(6, T('交付关口', 'Delivery gates'))}
      ${stat(7, T('布局国家', 'Countries in our footprint'))}
    </dl>
    <a class="scroll-cue" href="#about"><span class="mono">${T('向下滚动', 'Scroll')}</span><i aria-hidden="true"></i></a>
  </div>
</section>

<main id="main">
  <section class="section s-white" id="about" aria-labelledby="h-about">
    <div class="wrap">
      <div class="about-head">
        ${eyebrow('h-about', T('公司', 'The firm'), 'About', 'hub')}
        <p class="about-statement" data-fill>${T('诺元控股是总部位于新加坡的智算中心（AIDC）运营商。我们负责一座算力中心的全过程：<em>获取土地与电力，整合机电供应链，完成工程建设，并承担长期的运维与维保。</em>', 'Nourra Holdings is an AI data centre operator headquartered in Singapore. We take a facility through its whole life: <em>securing land and power, integrating the mechanical and electrical supply chain, building it, and running and maintaining it over the long term.</em>')}</p>
      </div>
      <ol class="lifecycle" aria-label="${T('一座算力中心的全过程', 'The whole life of a facility')}">
        <li><span class="lc-node">${icoInline('site')}</span><span class="lc-step mono">01</span><b>${T('获取土地与电力', 'Land and power')}</b><span class="lc-sub">${T('带电厂房 · 地块评估 · 电力接入', 'Powered buildings · land · grid connection')}</span></li>
        <li><span class="lc-node">${icoInline('package')}</span><span class="lc-step mono">02</span><b>${T('整合机电供应链', 'M&amp;E supply chain')}</b><span class="lc-sub">${T('配电 · 液冷 · 预制模块', 'Power · liquid cooling · modules')}</span></li>
        <li><span class="lc-node">${icoInline('building')}</span><span class="lc-step mono">03</span><b>${T('完成工程建设', 'Construction')}</b><span class="lc-sub">${T('土建 · 机电 · 上架联调', 'Building · M&amp;E · racking')}</span></li>
        <li><span class="lc-node">${icoInline('pulse')}</span><span class="lc-step mono">04</span><b>${T('长期运维与维保', 'Operations and maintenance')}</b><span class="lc-sub">${T('驻场值守 · 巡检 · 备件', 'On-site teams · inspection · spares')}</span></li>
      </ol>
    </div>
  </section>

  <section class="section s-paper" id="chain" aria-labelledby="h-chain">
    <div class="wrap">
      <header class="sec-head">
        ${eyebrow('h-chain', T('产业链', 'Value chain'), 'Value chain', 'layers')}
        <p class="sec-title">${T('从一度电到一次模型调用，中间隔着十层。', 'Ten layers sit between a unit of electricity and a single model call.')}</p>
        <p class="sec-lede">${T('点开每一层，看它是什么，以及诺元在哪里。', 'Open each layer to see what it is and where Nourra sits.')}</p>
      </header>
      <div class="chain" data-tabs="deploy">
        <div class="chain-left">
          <div class="chain-filter" role="group" aria-label="${T('按诺元的角色筛选', 'Filter by Nourra’s role')}">
            <button type="button" class="is-on" data-filter="all" aria-pressed="true">${T('全部', 'All')} <b class="mono">10</b></button>
            <button type="button" data-filter="core" aria-pressed="false"><i class="sw sw--core" aria-hidden="true"></i>${T('自有能力', 'Our own')} <b class="mono">6</b></button>
            <button type="button" data-filter="assist" aria-pressed="false"><i class="sw sw--assist" aria-hidden="true"></i>${T('协同配置', 'Arranged')} <b class="mono">3</b></button>
            <button type="button" data-filter="none" aria-pressed="false"><i class="sw sw--none" aria-hidden="true"></i>${T('上下游', 'Clients')} <b class="mono">1</b></button>
          </div>
          <div class="chain-body">
            <div class="chain-rail" aria-hidden="true"><span class="mono">${T('模型调用', 'Model call')}</span><i></i><span class="mono">${T('一度电', 'Electricity')}</span></div>
            <div class="chain-list" data-keys="v">
          ${layerButtons}
            </div>
          </div>
        </div>
        <div class="chain-panels" aria-live="polite">
          ${layerPanels}
        </div>
      </div>
    </div>
  </section>

  <section class="section band s-paper" id="inside" aria-labelledby="h-inside">
    <div class="band-bg" aria-hidden="true"></div>
    <div class="wrap">
      <header class="sec-head sec-head--dark">
        ${eyebrow('h-inside', T('机房内部', 'Inside the facility'), 'Inside the facility', 'rack')}
        <p class="sec-title">${T('一座智算机房只做两件事：把电送进机柜，把热带出去。', 'An AI data centre does two things: it gets power into the rack and takes heat out.')}</p>
        <p class="sec-lede">${T('切换电力或冷却路径，点击部件查看说明。', 'Switch between the power and cooling paths, and select a component to read about it.')}</p>
      </header>
      <div class="facility" data-tabs="rack" data-focus="all">
        <div class="facility-fig">
          <div class="seg" role="group" aria-label="${T('显示路径', 'Show path')}" data-pathtoggle>
            <button type="button" class="is-on" data-path-btn="all" aria-pressed="true">${T('全部', 'Both')}</button>
            <button type="button" data-path-btn="power" aria-pressed="false"><i class="sw sw--power" aria-hidden="true"></i>${T('电力路径', 'Power path')}</button>
            <button type="button" data-path-btn="cool" aria-pressed="false"><i class="sw sw--cool" aria-hidden="true"></i>${T('冷却路径', 'Cooling path')}</button>
          </div>
          <div class="facility-scroll">
            <svg class="facility-art" viewBox="0 0 1000 400" role="img" aria-label="${T('机房电力路径：市电、变压器、不间断电源、配电到机柜；冷却路径：冷却分配单元向机柜供液、回液，经室外散热排热。', 'Power path: grid, transformer, UPS and distribution to the racks. Cooling path: the coolant distribution unit supplies and returns coolant to the racks, and heat leaves through heat rejection.')}">
          <text class="lane" x="20" y="34" data-path="power">${T('电力路径', 'POWER PATH')}</text>
          <text class="lane" x="200" y="244" data-path="cool">${T('冷却路径', 'COOLING PATH')}</text>
          <g class="flows">
            <path class="flow-base flow--power" data-path="power" pathLength="1" d="M150 92H200M330 92H380M510 92H560M690 92H768"/>
            <path class="flow-base flow--supply" data-path="cool" pathLength="1" d="M330 284H560M690 284H768"/>
            <path class="flow-base flow--return" data-path="cool" pathLength="1" d="M768 320H690M560 320H330"/>
            <path class="flow flow--power" data-path="power" d="M150 92H200M330 92H380M510 92H560M690 92H768"/>
            <path class="flow flow--supply" data-path="cool" d="M330 284H560M690 284H768"/>
            <path class="flow flow--return" data-path="cool" d="M768 320H690M560 320H330"/>
          </g>
          ${nodeSvg}
          <g class="part part--rack" data-hl="rack" data-path="both">${rackSvg}<text x="874" y="374" text-anchor="middle">${T('机柜', 'Racks')}</text></g>
            </svg>
          </div>
          <ul class="legend"><li class="lg lg--power">${T('电力', 'Power')}</li><li class="lg lg--supply">${T('冷却液供液', 'Coolant supply')}</li><li class="lg lg--return">${T('冷却液回液', 'Coolant return')}</li></ul>
        </div>
        <div class="facility-side">
          <div class="chips">${chips}</div>
          <div class="facility-card" aria-live="polite">${partPanels}</div>
        </div>
      </div>
    </div>
  </section>

  <section class="section s-white" id="density" aria-labelledby="h-density">
    <div class="wrap">
      <header class="sec-head">
        ${eyebrow('h-density', T('密度', 'Density'), 'Density', 'gauge')}
        <p class="sec-title">${T('AI 机房和传统机房的差别，在单个机柜的功率。', 'What sets an AI data centre apart is the power in a single rack.')}</p>
        <p class="sec-lede">${T('拖动滑块，看同样 1 兆瓦电力下，机柜数量和制冷方式怎么变。', 'Drag the slider to see how rack count and cooling change for the same 1 MW of power.')}</p>
      </header>
      <div class="density" data-density="${bandsAttr}">
        <div class="density-ctrl">
          <div class="readout">
            <label for="kw">${T('单机柜功率', 'Power per rack')}</label>
            <output for="kw"><b data-out="kw">40</b><span>${T('千瓦', 'kW')}</span></output>
          </div>
          <div class="range">
            <div class="range-zones" aria-hidden="true"><span data-z="0">${T('风冷', 'Air')}</span><span data-z="1">${T('强化风冷', 'Enh. air')}</span><span data-z="2">${T('液冷', 'Liquid')}</span></div>
            <input id="kw" type="range" min="5" max="130" step="1" value="40">
            <div class="range-ticks mono" aria-hidden="true"><span style="--at:0">5</span><span style="--at:8">15</span><span style="--at:28">40</span><span style="--at:100">130 kW</span></div>
          </div>
          <div class="presets" role="group" aria-label="${T('常见取值', 'Typical values')}"><span>${T('示意', 'Try')}</span><button type="button" data-kw="8">${T('传统 8 kW', 'Conventional 8 kW')}</button><button type="button" data-kw="30">${T('高密度 30 kW', 'High density 30 kW')}</button><button type="button" data-kw="120">${T('GPU 整柜 120 kW', 'GPU rack 120 kW')}</button></div>
          <dl class="density-out">
            <div class="d-big"><dt>${T('1 兆瓦可供电的机柜数', 'Racks powered by 1 MW')}</dt><dd data-out="racks">25</dd></div>
            <div><dt>${T('机房类型', 'Type of facility')}</dt><dd data-out="kind">${densityBands[1].kind}</dd></div>
            <div><dt>${T('制冷方式', 'Cooling')}</dt><dd class="d-cool"><span class="cool-ico" aria-hidden="true">${ico('fan', 'ico ci ci--0')}${ico('airflow', 'ico ci ci--1')}${ico('coolant', 'ico ci ci--2')}</span><span data-out="cooling">${densityBands[1].cooling}</span></dd></div>
          </dl>
          <p class="note">${T('区间为行业常见取值，仅作示意；具体项目以设计文件为准。', 'Ranges are typical industry values, shown for illustration. Project figures follow the design documents.')}</p>
        </div>
        <div class="rack-floor">
          <div class="rack-floor-head mono"><span>1 MW · ${T('机柜布置示意', 'rack layout, illustrative')}</span><span><b data-out="racks2">25</b> ${T('台', 'racks')}</span></div>
          <div class="rack-grid" aria-hidden="true"></div>
          <div class="rack-floor-foot mono" aria-hidden="true"><span><i class="sw sw--rack0"></i>${T('风冷', 'Air')}</span><span><i class="sw sw--rack1"></i>${T('强化风冷', 'Enhanced air')}</span><span><i class="sw sw--rack2"></i>${T('液冷', 'Liquid')}</span></div>
        </div>
      </div>
    </div>
  </section>

  <section class="section s-paper" id="supply" aria-labelledby="h-supply">
    <div class="wrap">
      <div class="supply-head">
        <header class="sec-head">
          ${eyebrow('h-supply', T('供应链', 'Supply chain'), 'Supply chain', 'package')}
          <p class="sec-title">${T('一座机房能多快建成，一半取决于设备什么时候到。', 'How fast a facility gets built depends, as much as anything, on when the equipment arrives.')}</p>
          <p class="sec-lede">${T('我们把配电、液冷和预制模块作为一个整体来采购和交付。', 'We procure and deliver power distribution, liquid cooling and prefabricated modules as one package.')}</p>
        </header>
        <figure class="bundle" aria-label="${T('配电、液冷、预制模块合并为一个整体交付', 'Power distribution, liquid cooling and prefabricated modules combined into one delivery')}">
          <ul class="bundle-in">
            <li>${ico('switchboard')}<span>${T('配电设备', 'Power equipment')}</span></li>
            <li>${ico('coolant')}<span>${T('液冷系统', 'Liquid cooling')}</span></li>
            <li>${ico('module')}<span>${T('预制模块', 'Prefab modules')}</span></li>
          </ul>
          <svg class="bundle-lines" viewBox="0 0 80 180" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M0 30C40 30 40 90 80 90M0 90H80M0 150C40 150 40 90 80 90"/></svg>
          <div class="bundle-out">${ico('package')}<b>${T('整体交付', 'One package')}</b><span class="mono">${T('采购 · 集成 · 交付', 'Procure · integrate · deliver')}</span></div>
        </figure>
      </div>
      <div class="pipeline" data-tabs="s0" data-autoplay>
        <ol class="pipe-steps" data-progress data-keys="h">
            ${supplySteps}
        </ol>
        <div class="pipe-panels" aria-live="polite">
          ${supplyPanels}
        </div>
      </div>
    </div>
  </section>

  <section class="section s-white" id="business" aria-labelledby="h-business">
    <div class="wrap">
      <header class="sec-head">
        ${eyebrow('h-business', T('业务', 'Business'), 'Business', 'flow')}
        <p class="sec-title">${T('六条业务线，覆盖一座智算中心从选址到运营的每个阶段。', 'Six lines of business cover every stage of a facility, from site to operation.')}</p>
      </header>
      <ul class="biz-grid">
        ${bizCards}
      </ul>
    </div>
  </section>

  <section class="section band s-white" id="footprint" aria-labelledby="h-footprint">
    <div class="band-bg" aria-hidden="true"></div>
    <div class="wrap">
      <div class="world-head">
        <header class="sec-head sec-head--dark">
          ${eyebrow('h-footprint', T('布局', 'Footprint'), 'Footprint', 'globe')}
          <p class="sec-title">${T('立足新加坡，连接亚太、北美与欧洲。', 'Based in Singapore, connected across Asia-Pacific, North America and Europe.')}</p>
        </header>
        <dl class="world-stats">
          <div><dt>${groups.hq}</dt><dd><b data-count="1">1</b></dd></div>
          <div><dt>${T('机房项目国家', 'Project countries')}</dt><dd><b data-count="2">2</b></dd></div>
          <div><dt>${T('合作网络国家', 'Partner countries')}</dt><dd><b data-count="4">4</b></dd></div>
        </dl>
      </div>
      <div class="world" data-tabs="sg" data-hover>
        <div class="map" data-map>
          <img src="${base}assets/world-dots.svg" alt="" width="1080" height="384" loading="lazy">
          <canvas class="map-canvas" aria-hidden="true"></canvas>
          <span class="sea-ring" aria-hidden="true"></span>
            ${mapPins}
          <div class="map-tip" aria-hidden="true"><span class="tip-group mono"></span><b class="tip-name"></b><span class="tip-desc"></span></div>
        </div>
        <p class="map-note">${T('连线表示新加坡总部与各地的业务联系，不代表实际网络线路。标记位置为各国首都或主要城市。', 'Lines show business links from our Singapore headquarters, not physical network routes. Markers sit on capitals or major cities.')}</p>
        <div class="world-list">
          <div class="inset-card">
            <div class="inset-head"><span class="group">${T('东南亚放大', 'Southeast Asia, enlarged')}</span><span class="mono">98°E–110°E</span></div>
            <div class="inset" data-inset>
              <svg viewBox="0 0 240 290" aria-hidden="true">
                <g class="grat"><path d="M40 0V290M140 0V290M0 20H240M0 220H240"/></g>
                <path class="equator" d="M0 120H240"/>
                <text x="236" y="114" text-anchor="end">${T('赤道 0°', 'Equator 0°')}</text>
                <text x="236" y="14" text-anchor="end">5°N</text><text x="236" y="214" text-anchor="end">5°S</text>
                <text x="44" y="284">100°E</text><text x="144" y="284">105°E</text>
                <path class="inset-arc" d="${insetArc('my')}"/><path class="inset-arc" d="${insetArc('id')}"/>
                <path class="inset-comet" pathLength="100" d="${insetArc('my')}"/><path class="inset-comet inset-comet--2" pathLength="100" d="${insetArc('id')}"/>
              </svg>
              ${insetPins}
            </div>
          </div>
          <div class="world-group" data-group="${groups.hq}"><h3 class="group">${ico('hub', 'ico ico--sm')}${groups.hq}</h3><ul>${placeBtn('sg')}</ul>
            <h3 class="group">${ico('rack', 'ico ico--sm')}${groups.site}</h3><ul data-group="${groups.site}">${placeBtn('my')}${placeBtn('id')}</ul></div>
          <div class="world-group" data-group="${groups.net}"><h3 class="group">${ico('network', 'ico ico--sm')}${groups.net}</h3><ul class="two">${placeBtn('jp')}${placeBtn('us')}${placeBtn('nl')}${placeBtn('au')}</ul></div>
        </div>
      </div>
    </div>
  </section>

  <section class="section s-paper" id="delivery" aria-labelledby="h-delivery">
    <div class="wrap delivery">
      <div class="delivery-aside">
        <header class="sec-head">
          ${eyebrow('h-delivery', T('交付', 'Delivery'), 'Delivery', 'key')}
          <p class="sec-title">${T('一个集群从选址到上线，要过六道关。', 'A cluster passes six gates between site selection and go-live.')}</p>
        </header>
        <div class="gate-meter" aria-hidden="true">
          <div class="gate-count mono"><b data-gate-now>01</b><span>/ 06</span></div>
          <span class="gate-name" data-gate-name>${gates[0][1]}</span>
          <div class="gate-bar"><i></i></div>
        </div>
      </div>
      <ol class="timeline">
          ${gateItems}
      </ol>
    </div>
  </section>

  <section class="section s-white" id="principles" aria-labelledby="h-principles">
    <div class="wrap">
      <header class="sec-head">
        ${eyebrow('h-principles', T('原则', 'Principles'), 'Principles', 'shield')}
        <p class="sec-title">${T('我们做事的三条原则。', 'Three principles we work by.')}</p>
      </header>
      <ul class="principles">
        ${principles.map(([icon, name, text]) => `<li class="principle" data-spot><span class="pr-ico">${icoInline(icon)}</span><h3>${name}</h3><p>${text}</p></li>`).join('\n        ')}
      </ul>
    </div>
  </section>
</main>

<footer class="site-footer" id="contact" aria-labelledby="h-contact">
  <div class="footer-art" aria-hidden="true"><svg viewBox="30 14 60 92">${STEPS.map(([x, y], k) => `<rect x="${x}" y="${y}" width="16" height="16" rx="2" style="--k:${k}"/>`).join('')}<path class="fa-link" d="${LINK}"/><path class="fa-pulse" pathLength="1" d="${LINK}"/></svg></div>
  <div class="wrap contact">
    ${eyebrow('h-contact', T('联系', 'Contact'), 'Contact', 'mail')}
    <p class="contact-title">${T('我们主要通过既有的合作网络开展业务。<br>机构合作与项目洽谈，请来信。', 'We work mainly through established relationships.<br>For institutional partnerships and project discussions, write to us.')}</p>
    <div class="email-row">
      <a class="email" id="email" href="mailto:Sandy.goh@nourra.ai" translate="no">Sandy.goh@nourra.ai</a>
      <button type="button" class="btn btn--ghost btn--sm copy" data-copy="Sandy.goh@nourra.ai" data-target="#email" data-done="${T('已复制', 'Copied')}">${ico('copy', 'ico ico--sm')}<span class="copy-label">${T('复制邮箱', 'Copy address')}</span></button>
    </div>
    <div class="offices">
      <h3 class="group offices-title">${ico('site', 'ico ico--sm')}${T('办公室', 'Offices')}</h3>
      <ul class="office-list">
        ${officeCards}
      </ul>
    </div>
  </div>
  <div class="wrap footer-base">
    <div class="lockup" translate="no">${MARK('mark-glow-f')}<span class="lockup-text">${lockupText}</span></div>
    <ul class="footer-nav">${navList}</ul>
    <p class="legal">${T('© 2026 诺元控股 NOURRA HOLDINGS PTE. LTD.（UEN&nbsp;202628168R）保留所有权利。本站内容仅为公司介绍，不构成要约或任何形式的承诺。', '© 2026 NOURRA HOLDINGS PTE. LTD. (UEN&nbsp;202628168R). All rights reserved. This site is a company introduction and is not an offer or commitment of any kind.')}</p>
    <a class="to-top" href="#top" aria-label="${T('回到顶部', 'Back to top')}">${ico('arrow-up', 'ico ico--sm')}</a>
  </div>
</footer>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js" defer></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js" defer></script>
<script src="${base}assets/main.js" defer></script>`;

  const out = zh ? phraseTitles(body) : body;
  if (zh && !SITE_MODE) return `${head}${common}\n${out}\n`;
  return `${head}${common}\n</head>\n<body>\n${out}\n</body>\n</html>\n`;
}

fs.mkdirSync(path.join(OUT, 'en'), { recursive: true });
fs.writeFileSync(path.join(OUT, 'index.html'), page('zh'));
fs.writeFileSync(path.join(OUT, 'en', 'index.html'), page('en'));
console.log('built', OUT);
