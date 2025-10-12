// Auto-fill Flashcard Deck - English Grammar: Tenses
// วิธีใช้: คัดลอกโค้ดนี้ไปวางใน Console ของเบราว์เซอร์ที่หน้า FlashcardView

(function() {
  console.log('🎯 Starting Flashcard Auto-fill...');

  // ฟังก์ชันสำหรับ trigger input event ให้ Vue รับรู้
  const setInputValue = (element, value) => {
    if (!element) return false;

    // Set value
    element.value = value;

    // Trigger input event for Vue reactivity
    const inputEvent = new Event('input', { bubbles: true, cancelable: true });
    element.dispatchEvent(inputEvent);

    // Trigger change event
    const changeEvent = new Event('change', { bubbles: true, cancelable: true });
    element.dispatchEvent(changeEvent);

    return true;
  };

  // ค้นหา Vue component instance จาก DOM (หลายวิธี)
  const findVueComponent = () => {
    // วิธีที่ 1: ลองใช้ Vue DevTools API
    if (window.__VUE_DEVTOOLS_GLOBAL_HOOK__) {
      try {
        const apps = window.__VUE_DEVTOOLS_GLOBAL_HOOK__.apps;
        if (apps && apps.length > 0) {
          const app = apps[0];
          // ค้นหา component ที่มี FlashcardView
          console.log('🔍 พยายามใช้ Vue DevTools API...');
        }
      } catch (e) {
        console.log('⚠️ ไม่สามารถใช้ Vue DevTools API');
      }
    }

    // วิธีที่ 2: ค้นหาจาก DOM element
    const possibleSelectors = [
      'input[placeholder*="Enter an engaging title"]',
      'input[placeholder*="deck"]',
      'div[data-v-2d080d3d]'
    ];

    for (const selector of possibleSelectors) {
      const element = document.querySelector(selector);
      if (element) {
        console.log(`✅ พบ element: ${selector}`);

        // ลองหา Vue instance จาก element
        let current = element;
        let attempts = 0;
        while (current && attempts < 20) {
          // Vue 3 มี __vueParentComponent หรือ __vnode
          if (current.__vueParentComponent) {
            console.log('✅ พบ Vue component ผ่าน __vueParentComponent');
            return current.__vueParentComponent.ctx;
          }
          if (current._vnode && current._vnode.component) {
            console.log('✅ พบ Vue component ผ่าน _vnode');
            return current._vnode.component.ctx;
          }
          if (current.__vnode && current.__vnode.component) {
            console.log('✅ พบ Vue component ผ่าน __vnode');
            return current.__vnode.component.ctx;
          }
          current = current.parentElement;
          attempts++;
        }
      }
    }
    return null;
  };

  const vm = findVueComponent();

  if (!vm) {
    console.warn('⚠️ ไม่พบ Vue component instance');
    console.log('💡 จะใช้วิธี DOM manipulation แทน');
  } else {
    console.log('✅ พบ Vue component แล้ว');
  }

  // ข้อมูล Flashcard Deck ภาษาอังกฤษ - English Grammar: Tenses
  const deckData = {
    title: 'English Grammar: Essential Tenses',
    subject: 'English Language',
    tags: 'grammar, tenses, english, verb forms',
    difficulty: 'medium',
    cards: [
      {
        front: 'What is the Present Simple tense used for?',
        back: 'The Present Simple tense is used for habits, routines, general truths, and permanent situations. Example: "I work every day." or "The sun rises in the east."'
      },
      {
        front: 'What is the structure of Present Continuous tense?',
        back: 'Subject + am/is/are + verb(-ing). Used for actions happening now or temporary situations. Example: "She is reading a book right now."'
      },
      {
        front: 'When do we use Past Simple tense?',
        back: 'Past Simple is used for completed actions in the past. Structure: Subject + verb(ed) or irregular past form. Example: "I visited Paris last year."'
      },
      {
        front: 'What is the difference between Present Perfect and Past Simple?',
        back: 'Present Perfect (have/has + past participle) connects past to present and doesn\'t specify when. Past Simple specifies a finished time. Example: "I have been to Japan" vs "I went to Japan in 2020."'
      },
      {
        front: 'How do we form Future Simple tense?',
        back: 'Future Simple uses will + base verb for predictions, promises, and spontaneous decisions. Example: "It will rain tomorrow." or "I\'ll help you with that."'
      },
      {
        front: 'What is Past Continuous used for?',
        back: 'Past Continuous (was/were + verb-ing) describes actions in progress at a specific time in the past or interrupted actions. Example: "I was studying when the phone rang."'
      },
      {
        front: 'When do we use Present Perfect Continuous?',
        back: 'Present Perfect Continuous (have/has been + verb-ing) emphasizes the duration of an action that started in the past and continues to present. Example: "I have been learning English for 5 years."'
      },
      {
        front: 'What is the structure of Future Continuous?',
        back: 'Future Continuous uses will be + verb(-ing) for actions that will be in progress at a specific time in the future. Example: "This time tomorrow, I will be flying to New York."'
      },
      {
        front: 'How do we use Past Perfect tense?',
        back: 'Past Perfect (had + past participle) shows an action completed before another past action. Example: "By the time I arrived, they had already left."'
      },
      {
        front: 'What is "going to" used for in Future tense?',
        back: '"Going to" is used for planned future actions and predictions based on present evidence. Structure: am/is/are + going to + verb. Example: "I\'m going to study abroad next year."'
      }
    ]
  };

  try {
    console.log('📝 กำลังกรอกข้อมูล...');

    // วิธีที่ 1: ใช้ Vue component instance (ถ้ามี)
    if (vm) {
      console.log('🎯 ใช้วิธี Vue Component Instance');

      // ตั้งค่าข้อมูลพื้นฐานของ deck
      vm.title = deckData.title;
      vm.subject = deckData.subject;
      vm.tags = deckData.tags;
      vm.difficulty = deckData.difficulty;

      // ล้าง cards เดิมและเพิ่ม cards ใหม่
      vm.cards = deckData.cards.map((card, index) => ({
        id: (Date.now() + index).toString(),
        front: card.front,
        back: card.back
      }));
    }
    // วิธีที่ 2: ใช้ DOM manipulation
    else {
      console.log('🎯 ใช้วิธี DOM Manipulation');

      // กรอก Title
      const titleInput = document.querySelector('input[placeholder*="Enter an engaging title"]');
      if (titleInput) {
        setInputValue(titleInput, deckData.title);
        console.log('✅ กรอก Title แล้ว');
      }

      // กรอก Subject
      const subjectInput = document.querySelector('input[placeholder*="Mathematics, Biology"]');
      if (subjectInput) {
        setInputValue(subjectInput, deckData.subject);
        console.log('✅ กรอก Subject แล้ว');
      }

      // กรอก Tags
      const tagsInput = document.querySelector('input[placeholder*="algebra, equations"]');
      if (tagsInput) {
        setInputValue(tagsInput, deckData.tags);
        console.log('✅ กรอก Tags แล้ว');
      }

      // คลิก Difficulty button
      const difficultyButtons = document.querySelectorAll('button span.capitalize');
      for (const span of difficultyButtons) {
        if (span.textContent.trim() === deckData.difficulty) {
          span.parentElement.click();
          console.log(`✅ เลือก Difficulty: ${deckData.difficulty}`);
          break;
        }
      }

      // สำหรับ cards - ต้องคลิก Add Card button หลายๆ ครั้ง
      const addCardButton = Array.from(document.querySelectorAll('button')).find(
        btn => btn.textContent.includes('Add Card')
      );

      if (addCardButton) {
        // คลิกเพิ่ม card ตามจำนวนที่ต้องการ (ลบ 1 เพราะมี 1 card อยู่แล้ว)
        for (let i = 1; i < deckData.cards.length; i++) {
          setTimeout(() => addCardButton.click(), i * 100);
        }

        // รอให้ cards ถูกสร้างแล้วค่อยกรอกข้อมูล
        setTimeout(() => {
          const frontTextareas = document.querySelectorAll('textarea[placeholder*="question or prompt"]');
          const backTextareas = document.querySelectorAll('textarea[placeholder*="answer or explanation"]');

          deckData.cards.forEach((card, index) => {
            if (frontTextareas[index]) {
              setInputValue(frontTextareas[index], card.front);
            }
            if (backTextareas[index]) {
              setInputValue(backTextareas[index], card.back);
            }
          });

          console.log(`✅ กรอก ${deckData.cards.length} cards แล้ว`);
        }, deckData.cards.length * 150);
      }
    }

    console.log('');
    console.log('✅ Auto-fill สำเร็จ!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📚 Deck: ${deckData.title}`);
    console.log(`📖 Subject: ${deckData.subject}`);
    console.log(`🏷️  Tags: ${deckData.tags}`);
    console.log(`⚡ Difficulty: ${deckData.difficulty}`);
    console.log(`🃏 Cards: ${deckData.cards.length} cards`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    console.log('💡 ตอนนี้คุณสามารถ scroll ลงไปดูและกด "Save Deck" เพื่อบันทึกได้เลย');
    console.log('⏰ รอสักครู่ให้ระบบกรอกข้อมูลให้เสร็จก่อน (ประมาณ 2-3 วินาที)');

  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาด:', error);
    console.log('');
    console.log('💡 วิธีแก้ไข:');
    console.log('1. ลอง refresh หน้าเว็บ (F5)');
    console.log('2. ตรวจสอบว่าคุณอยู่ในหน้า Create Flashcard');
    console.log('3. ลองรันโค้ดอีกครั้ง');
  }
})();

