<?php
class Controller__Class extends Page
{
    public function index()
    {
        $this->load->language('__File');

        $data = [];

        $this->load->controller('wrapper', $this->load->view('__File', $data));
    }
}
