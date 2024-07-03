document.getElementById('image1').addEventListener('change', handleImageUpload);
document.getElementById('image2').addEventListener('change', handleImageUpload);
document.getElementById('image3').addEventListener('change', handleImageUpload);
document.getElementById('budget').addEventListener('input', handleBudgetInput);
document.getElementById('budget').addEventListener('blur', function() {
    addCurrencySymbol(this);
});
document.getElementById('analyze').addEventListener('click', function() {
    if (this.disabled) {
        showToast('이미지 업로드 및 예산을 입력해 주세요');
    } else {
        handleAnalyze();
    }
});
document.getElementById('signup-btn').addEventListener('click', showPopup);
document.getElementById('record').addEventListener('click', showPopup);
document.getElementById('share').addEventListener('click', shareResult);
document.getElementById('gnb-share-btn').addEventListener('click', sharePageLink);

function handleImageUpload(event) {
    const file = event.target.files[0];
    const fileName = file ? file.name : null;

    // 중복 파일 체크
    const imageFiles = [
        document.getElementById('image1').files[0],
        document.getElementById('image2').files[0],
        document.getElementById('image3').files[0]
    ];

    const fileNames = imageFiles.map(file => file ? file.name : null);
    const fileCount = fileNames.filter(name => name === fileName).length;

    if (fileCount > 1) {
        alert('중복된 파일은 등록할 수 없습니다');
        event.target.value = ''; // 파일 선택 취소
        return;
    }

    const previewId = "preview" + event.target.id.charAt(event.target.id.length - 1);
    const preview = document.getElementById(previewId);

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.src = e.target.result;
            preview.style.display = 'block';
        }
        reader.readAsDataURL(file);
    } else {
        preview.src = '';
        preview.style.display = 'none';
    }

    checkInputs();
}

function handleBudgetInput(event) {
    inputCurrencyFormat(event.target);
    checkInputs();
}

function addCurrencySymbol(input) {
    let value = input.value.trim();
    if (value !== '' && !value.startsWith('₩ ')) {
        input.value = '₩ ' + value;
    }
}

function checkInputs() {
    const image1 = document.getElementById('image1').files.length > 0;
    const image2 = document.getElementById('image2').files.length > 0;
    const image3 = document.getElementById('image3').files.length > 0;
    const budget = document.getElementById('budget').value.trim() !== '₩' && document.getElementById('budget').value.trim() !== '';

    const analyzeButton = document.getElementById('analyze');
    if (image1 && image2 && image3 && budget) {
        analyzeButton.disabled = false;
        analyzeButton.style.backgroundColor = 'black';
        analyzeButton.style.cursor = 'pointer';
    } else {
        analyzeButton.disabled = true;
        analyzeButton.style.backgroundColor = 'lightgray';
        analyzeButton.style.cursor = 'not-allowed';
    }
}

function comma(str) {
    str = String(str);
    return str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
}

function uncomma(str) {
    str = String(str);
    return str.replace(/[^\d]+/g, '');
} 

function inputCurrencyFormat(obj) {
    let value = uncomma(obj.value.replace('₩', '').trim());
    if (value === '') {
        obj.value = '';
    } else {
        obj.value = '₩ ' + comma(value);
    }
}

function inputOnlyNumberFormat(obj) {
    let value = uncomma(obj.value.replace('₩', '').trim());
    if (value === '') {
        obj.value = '';
    } else {
        obj.value = '₩ ' + onlynumber(value);
    }
}

function onlynumber(str) {
    str = String(str);
    return str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1');
}

function handleAnalyze() {
    // 진단 결과 및 추천 제품을 표시 (여기서는 예시 데이터를 사용합니다)
    document.getElementById('predicted-age').innerText = "피부 연령: 25세";
    document.getElementById('recommended-products').innerText = "추천 제품: 크림, 세럼, 선크림";

    // 진단 결과 및 추천 제품 섹션의 글씨 색상 변경
    document.getElementById('predicted-age').style.color = "black";
    document.getElementById('recommended-products').style.color = "black";

    // 회원가입하고 기록하기 및 공유하기 버튼 활성화
    document.getElementById('record').classList.add('active');
    document.getElementById('record').disabled = false;
    document.getElementById('share').classList.add('active');
    document.getElementById('share').disabled = false;

    // '분석하기' 버튼 비활성화 및 색상 변경
    document.getElementById('analyze').disabled = true;
    document.getElementById('analyze').style.backgroundColor = 'lightgray';
}

// 초기 로드 시 기록하기 및 공유하기 버튼 비활성화
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('record').disabled = true;
    document.getElementById('share').disabled = true;

    // 비활성화된 버튼 클릭 시 이벤트 막기
    document.getElementById('record').addEventListener('click', function(event) {
        if (this.disabled) {
            event.preventDefault();
        }
    });
    document.getElementById('share').addEventListener('click', function(event) {
        if (this.disabled) {
            event.preventDefault();
        }
    });
});

function showPopup() {
    alert('준비 중입니다.');
}

function shareResult() {
    const predictedAge = document.getElementById('predicted-age').innerText;
    const recommendedProducts = document.getElementById('recommended-products').innerText;
    const shareText = `${predictedAge}\n${recommendedProducts}\n\n친구의 피부 연령대가 궁금하다면? "https://yourdomain.com"을 전해보세요!`;
    
    navigator.clipboard.writeText(shareText).then(function() {
        showToast('분석 결과가 복사되었습니다.');
    }, function(err) {
        console.error('Failed to copy text: ', err);
    });
}

function sharePageLink() {
    const pageURL = "https://yourdomain.com";
    
    navigator.clipboard.writeText(pageURL).then(function() {
        showToast('링크가 복사되었습니다.');
    }, function(err) {
        console.error('Failed to copy text: ', err);
    });
}

function showToast(message) {
    const toast = document.getElementById("toast");
    toast.innerText = message;
    toast.className = "toast show";
    setTimeout(function() { toast.className = toast.className.replace("show", ""); }, 3000);
}
