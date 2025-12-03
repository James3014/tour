#!/usr/bin/env node
require('./register-ts');

const { SKI_TEMPLATES } = require('../lib/templates');
const { CHECKLIST_TEMPLATES } = require('../lib/templates/checklists');
const { PACKING_TEMPLATES } = require('../lib/templates/packing');

function buildMap(items) {
  const map = new Map();
  for (const item of items) {
    map.set(item.template_id, item);
  }
  return map;
}

function main() {
  const templates = SKI_TEMPLATES;
  const checklistMap = buildMap(CHECKLIST_TEMPLATES);
  const packingMap = buildMap(PACKING_TEMPLATES);

  const missingChecklist = [];
  const missingPacking = [];

  for (const tpl of templates) {
    if (!checklistMap.has(tpl.template_id)) {
      missingChecklist.push(tpl.template_id);
    }
    if (!packingMap.has(tpl.template_id)) {
      missingPacking.push(tpl.template_id);
    }
  }

  const extraChecklist = [...checklistMap.keys()].filter(
    (id) => !templates.some((tpl) => tpl.template_id === id)
  );
  const extraPacking = [...packingMap.keys()].filter(
    (id) => !templates.some((tpl) => tpl.template_id === id)
  );

  if (
    missingChecklist.length ||
    missingPacking.length ||
    extraChecklist.length ||
    extraPacking.length
  ) {
    console.error('[templates:validate] 發現以下不一致：');
    if (missingChecklist.length) {
      console.error(' - 缺少 Checklist：', missingChecklist.join(', '));
    }
    if (missingPacking.length) {
      console.error(' - 缺少 Packing：', missingPacking.join(', '));
    }
    if (extraChecklist.length) {
      console.error(' - 未使用 Checklist：', extraChecklist.join(', '));
    }
    if (extraPacking.length) {
      console.error(' - 未使用 Packing：', extraPacking.join(', '));
    }
    process.exit(1);
  }

  console.log(
    `[templates:validate] ${templates.length} templates, ` +
      `${CHECKLIST_TEMPLATES.length} checklists, ${PACKING_TEMPLATES.length} packing 清單 — OK`
  );
}

main();
