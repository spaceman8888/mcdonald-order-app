import * as menuService from '../services/menuService';

// 서비스 테스트 함수
export const testMenuService = async() =>{
    try {
        console.log("테스트 시작: 메뉴 카테고리 조회");
        const categories = await menuService.getMenuCategories();
        console.log("카테고리 목록:", categories);
    
        if (categories.length > 0) {
          console.log(`테스트: ${categories[0].name} 카테고리의 메뉴 아이템 조회`);
          const items = await menuService.getMenuItemsByCategory(categories[0].id);
          console.log("메뉴 아이템:", items);
    
          if (items.length > 0) {
            console.log(`테스트: ${items[0].name} 상세 정보 조회`);
            const details = await menuService.getMenuItemDetails(items[0].id);
            console.log("상세 정보:", details);
          }
        }
    
        console.log("테스트: 메뉴 검색 (버거)");
        const searchResults = await menuService.searchMenuItems("버거");
        console.log("검색 결과:", searchResults);
    
        console.log("모든 테스트 완료!");
    } catch (error) {
        console.error("테스트 중 오류 발생:", error);
    }
}