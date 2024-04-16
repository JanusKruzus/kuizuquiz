<?php
class KanjiController extends Controller {
    public function procces($params) {
        $this->view = "kanji";
        
        if(empty($params[0])){
            
        }
        else{
            $kanji = $params[0];
            echo $kanji . "AAAAAAAA";



        }
    }
}